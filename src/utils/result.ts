import { ApplicationError } from "utils";

export class Result<T> {
  success: boolean;
  data?: T;
  code?: number;
  error?: ApplicationError;

  private constructor(sucesso: boolean) {
    this.success = sucesso;
  }

  private addError(error: ApplicationError, code: number): void {
    this.error = error;
    this.code = code;
  }

  private addData(data?: T): void {
    this.data = data;
    this.code = 200;
  }

  public static error(code: number, error: ApplicationError): Result<any> {
    const result = new Result<any>(false);
    result.addError(error, code);
    return result;
  }

  public static success<T>(resposta?: T): Result<T> {
    const result = new Result<T>(true);
    result.addData(resposta);
    return result;
  }
}