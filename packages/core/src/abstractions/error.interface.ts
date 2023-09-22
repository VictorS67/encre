export interface IError {
  status: number;
  fields: {
    name: {
      message: string;
    };
  };
  message: string;
  name: string;
}