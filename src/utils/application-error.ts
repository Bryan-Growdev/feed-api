export interface ApplicationErrorDetail {
	name: string;
	description: string;
}

export class ApplicationError {
	process: string;
	message: string;
	details: ApplicationErrorDetail[];

	constructor(
		process: string,
		message: string,
		details: ApplicationErrorDetail[],
	) {
		this.process = process;
		this.message = message;
		this.details = details;
	}
}
