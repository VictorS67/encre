import { EncreAppHander } from './handlers';

export interface EncreAppConfig {
  workflow: string;
  handlers: Record<string, EncreAppHander>;
}
