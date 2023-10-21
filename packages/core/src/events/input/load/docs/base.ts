import { Context } from './context';

/**
 * Interface that defines the loader for loading readable source.
 */
export interface Loader<T = unknown> {
  load(source: T): Promise<Context[]>;
}

/**
 * Abstract class that provides an abstract load() event from the Loader 
 * interface.
 */
export abstract class BaseLoader<T = unknown>
  implements Loader<T>
{
  /**
   * Abstract method that loads the readable source.
   * @returns A Promise that resolves with an array of `Context` instances.
   */
  abstract load(source: T): Promise<Context[]>;
}

// /**
//  * Function is the event to load the source to an array of `Context` instances.
//  * @param loader The loader for loading readable source.
//  * @param sourceProvider the source provider for providing readable source.
//  * @returns A Promise that resolves with an array of `Context` instances.
//  */
// export async function loadInput(
//   loader: Loader,
//   sourceProvider: SourceProvider
// ): Promise<Context[]> {
//   return loader.load(sourceProvider.provide());
// }
