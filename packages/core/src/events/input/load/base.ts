import { Context } from './context';

/**
 * Interface that defines the events for loading readable contexts.
 */
export interface Loader {
  load(): Promise<Context[]>;
}

/**
 * Abstract class that provides an abstract load() event from the
 * Loader interface.
 */
export abstract class BaseLoader implements Loader {
  /**
   * Abstract method that loads the readable contexts.
   * @returns A Promise that resolves with an array of Context instances.
   */
  abstract load(): Promise<Context[]>;
}
