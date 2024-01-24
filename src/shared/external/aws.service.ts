import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsEnvironments } from '@envs/.';
import { randomUUID } from 'node:crypto';

export interface AwsService {
	upload(base64: string, ext: string): Promise<string>;
	delete(fileKey: string): Promise<void>;
	generateUrl(key: string): Promise<string>;
}

export class AwsServiceImp implements AwsService {
	private client: S3;

	constructor() {
		this.client = new S3({
			region: awsEnvironments.AWS_REGION,
			credentials: {
				accessKeyId: awsEnvironments.AWS_ACCESS_KEY_ID,
				secretAccessKey: awsEnvironments.AWS_SECRET_ACCESS_KEY,
			},
		});
	}

	async upload(base64: string, ext: string): Promise<string> {
		const fileKey = randomUUID();

		const buffer = Buffer.from(
			base64.replace(/^data:image\/\w+;base64,/, ''),
			'base64',
		);

		console.log(ext);

		await this.client.putObject({
			Bucket: awsEnvironments.BUCKET_NAME,
			Key: fileKey,
			Body: buffer,
			ContentType: ext,
		});

		return fileKey;
	}

	async delete(fileKey: string): Promise<void> {
		await this.client.deleteObject({
			Bucket: awsEnvironments.BUCKET_NAME,
			Key: fileKey,
		});
	}

	async generateUrl(key: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: awsEnvironments.BUCKET_NAME,
			Key: key,
		});

		const url = await getSignedUrl(this.client, command, {
			expiresIn: awsEnvironments.AWS_SIGNATURE_EXPIREIN,
		});

		return url;
	}
}
