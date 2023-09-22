import { IError } from '../../error.interface.js';

class ApiError extends Error implements IError {
  public status = 500;

  public success = false;

  public fields!: {
    name: {
      message: string;
    };
  };

  constructor(msg: string, statusCode: number, name: string = 'ApiError') {
    super();

    this.message = msg;
    this.status = statusCode;
    this.name = name;
  }
}

export default ApiError;
