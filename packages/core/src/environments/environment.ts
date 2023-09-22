import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
import { EnvironmentFile, Environments } from './environment.constant.js';
import { IEnvironment } from './environment.interface.js';

class Environment implements IEnvironment {
  public port: number;

  public secretKey: string;

  public applyEncryption: boolean;

  public env: string;

  constructor(NODE_ENV?: string) {
    this.env = NODE_ENV || Environments.LOCAL;

    this.setEnvironment(this.env);
    const port: string | undefined | number = process.env.PORT || 8080;
    this.port = Number(port);

    // TODO: Apply Encryption
  }

  public getCurrentEnvironment(): string {
    return this.env;
  }

  public setEnvironment(env: string): void {
    let envPath: string;

    const __filename: string = fileURLToPath(import.meta.url);
    const __dirname: string = path.dirname(__filename);
    const rootdir: string = path.resolve(__dirname, '../../');

    switch (env) {
      case Environments.PRODUCTION:
        envPath = path.resolve(rootdir, EnvironmentFile.PRODUCTION);
        break;
      case Environments.TEST:
        envPath = path.resolve(rootdir, Environments.TEST);
        break;
      case Environments.STAGING:
        envPath = path.resolve(rootdir, EnvironmentFile.STAGING);
        break;
      case Environments.LOCAL:
        envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
        break;
      default:
        envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
    }

    if (!fs.existsSync(envPath)) {
      throw new Error('.env file is missing in the root dir');
    }

    configDotenv({ path: envPath });
    this.env = process.env.NODE_ENV || env || Environments.LOCAL;
  }

  public isProductionEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.PRODUCTION;
  }

  public isDevEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.LOCAL;
  }

  public isStagingEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.STAGING;
  }

  public isTestEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.STAGING;
  }
}

export default Environment;
