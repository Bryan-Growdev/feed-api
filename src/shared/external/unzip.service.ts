import AdmZip from "adm-zip";
import * as fs from 'fs';
import { promisify } from "util";

export interface UnzipService {
  unzip(filePath: string): Promise<string>;
}

export class UnzipServiceImp implements UnzipService {
  async unzip(filePath: string): Promise<string> {
    console.log('INICIOU O EXTRACT');

    if (!fs.existsSync('unzips')) {
      fs.mkdirSync('unzips');
    }

    const zip = new AdmZip(filePath);

    const unzipAsync = promisify(zip.extractAllToAsync);

    const dirName = filePath.replaceAll(/(zips\/)|(\.zip)/g, '');

    const outputDir = `unzips/${dirName}`;

    await unzipAsync(outputDir, true, true);

    return outputDir;
  }
}