export class InternalError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
