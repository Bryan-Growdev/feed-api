import 'dotenv/config';

export const awsEnvironments = {
	BUCKET_NAME: process.env.BUCKET_NAME as string,
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
	AWS_REGION: process.env.AWS_REGION as string,
	AWS_SIGNATURE_EXPIREIN: parseInt(process.env.AWS_SIGNATURE_EXPIREIN as string),
};
