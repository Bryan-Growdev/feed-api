import 'dotenv/config';

export const appEnvironments = {
  PORT: Number(process.env.PORT as string),
}