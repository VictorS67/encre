import { Methods } from './baserouter.constant.js';

export interface IRouter {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}
