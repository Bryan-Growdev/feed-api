import { appEnvironments, mongoEnvironment } from '@envs/.';
import { UploadOrderController } from 'app/controllers';
import cors from 'cors';
import express, { Request, Response, json } from 'express';
import mongoose from 'mongoose';
const { PORT } = appEnvironments;
const { mongoHost } = mongoEnvironment

const app = express();
const router = express.Router();

const controller = new UploadOrderController();

router.put('/upload-zip', controller.execute);
router.get('/', (req: Request, res: Response) => {
  console.log('API OK');
  return res.status(200).json({
    ok: true,
    mensagem: 'Tudo certo por aqui'
  })
});

app.use(json(), cors());
app.use('/', router);

mongoose.connect(mongoHost)
  .then(() => {
    const server = app.listen(PORT, () => console.log(`API running at ${PORT}`));
    server.setTimeout(3.6e+6)
    server.on('error', (err) => console.log(`ERRO HANDLER: ${err}`));
    server.on('clientError', (err) => console.log(`ERRO NO HANDLER 2: ${err}`));
  })
  .catch((err) => console.log(`ERRO: ${err}`));
