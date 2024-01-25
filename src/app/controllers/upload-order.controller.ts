import { AwsServiceImp, UnzipServiceImp } from "@shared/external";
import { Asset, Product } from "@shared/models";
import { ProductSchema } from "@shared/schemas";
import { Request, Response } from "express";
import * as fs from 'fs';
import path from "path";
import { Messages } from "utils";

export class UploadOrderController {
  async execute(request: Request, response: Response) {
    const unzipService = new UnzipServiceImp();

    request.setTimeout(3.6e+6);
    response.setTimeout(3.6e+6);

    if (request.headers['content-type']?.split('/')[1] !== 'zip') {
      return response.status(400).send('BAD REQUEST')
    }

    const conversionFactor = 1024 * 1024;
    const total: number = (Number(request.headers['content-length'] as string) / conversionFactor);
    let count = 0;
    let percentage = 0;
    const byteValue = 100 / total;

    const { filePath } = request.query;

    if (!filePath || typeof filePath !== 'string') {
      return response.status(400).send('ARQUIVO SEM NOME')
    }

    if (!fs.existsSync('zips')) {
      fs.mkdirSync('zips');
    }

    const finalPath = `zips/${filePath}`;

    fs.rmSync(finalPath, { force: true, recursive: true });

    const stream = fs.createWriteStream(finalPath);

    const saveBuffer = (data: Buffer) => {
      const mb = data.byteLength / conversionFactor;
      count += mb;
      percentage += mb * byteValue;

      console.table({ rBytes: count.toFixed(2) + '/' + total, percentage: percentage.toFixed(2) + '%' });
      stream.write(data);
    };

    request
      .on('resume', () => console.log('RESUMED'))
      .on('pause', () => console.log('PAUSED'))
      .on('error', (err) => {
        console.log(err);
        return response.status(500).json({
          ok: false,
          message: Messages.readableStreamError,
        });
      })
      .on('data', saveBuffer)
      .on('end', () => stream.close(
        (err) => err
          ? console.log(`erro ao fechar stream: ${err}`)
          : null
      ))
      .on('close', () => console.log('CLOSED'));

    stream.on('close', () => {
      console.log('WRITABLE CLOSED');

      unzipService.unzip(finalPath).then((outDir) => {
        response.status(200).json({ ok: true });

        fs.rmSync(finalPath, { force: true, recursive: true });

        sendToDatabases(outDir);
      }).catch((err) => {
        console.log('ERRO NO UNZIP: ');
        console.log(err);

        return response.status(500).json({
          ok: false,
          message: Messages.unzipError,
        });
      });
    });
  }
}

async function sendToDatabases(parentPath: string) {
  const jsonPath = path.join(parentPath, 'products.json');

  const { data } = JSON.parse(fs.readFileSync(jsonPath).toString());

  for (let product of data as Product[]) {
    const exist = await ProductSchema.exists({ id: product.id });

    if (exist) {
      // Verificar se algum asset está sem fileKey
      console.log('Já existe');
      // await updateProduct(product);

      continue;
    }

    try {
      const productAssetsPath = `${parentPath}/productAssets`;
      const itemAssetsPath = `${parentPath}/itemAssets`;

      for (const index in product.images) {
        const oldState = product.images[index];

        const fileKey = await uploadAsset(oldState, productAssetsPath);

        if (fileKey) {
          product.images[index] = {
            ...oldState,
            fileKey
          }
        }
      }

      for (const index in product.documents) {
        const oldState = product.documents[index];

        const fileKey = await uploadAsset(oldState, productAssetsPath);

        if (fileKey) {
          product.documents[index] = {
            ...oldState,
            fileKey
          }
        }
      }

      for (const itemIndex in product.items) {
        let item = product.items[itemIndex];

        for (let index = 0; index < item.images.length; index++) {
          const oldState = item.images[index];

          const fileKey = await uploadAsset(oldState, itemAssetsPath);

          if (fileKey) {
            item.images[index] = {
              ...oldState,
              fileKey
            }
          }
        }

        for (const index in item.documents) {
          const oldState = item.documents[index];

          const fileKey = await uploadAsset(oldState, itemAssetsPath);

          if (fileKey) {
            item.documents[index] = {
              ...oldState,
              fileKey
            }
          }
        }

        product.items[itemIndex] = item;
      }
    } catch (error) {
      console.error('OCORREU UM ERRO');
      console.log(error);
    }

    console.error('UPLOAD PARA BANCOS FINALIZADO');
    await ProductSchema.create(product);
  }

  fs.rmSync(parentPath, { recursive: true, force: true });
  console.log('TUDO CERTO, removendo diretório');
}

async function uploadAsset(asset: Asset, parentPath: string): Promise<string | void> {
  let assetPath: string;
  let ext: string;

  if (asset.wasDeleted) return;

  if (asset.isNewAsset) {
    ext = asset.name.split('.').pop() as string;
    assetPath = asset.name;
  } else {
    const nameSplit = asset.name.split('.');
    ext = nameSplit[nameSplit.length - 1];
    assetPath = asset.id + '.' + ext;
  }

  const fullPath = path.join(parentPath, assetPath);

  console.log(fullPath);

  const fileExist = fs.existsSync(fullPath);

  if (!fileExist) {
    console.log('NÃO EXISTE: ' + assetPath);

    return;
  }

  const key = await new AwsServiceImp().upload(fs.readFileSync(fullPath, { encoding: 'base64' }), ext);

  return key;
}

// async function updateProduct(product: Product) {
//   const dbProduct = await ProductSchema.findOne({ id: product.id })!;

//   for (const asset of product.images) {
//     if (asset.wasDeleted) {}
//   }
// }