import { nanoid, customAlphabet, customRandom } from 'nanoid';
import { RecordId } from '../load/keymap.js';

/**
 * Provides a mechanism for generating unique identifiers using the `nanoid` library.
 * This class supports customization of the character set used for generating the IDs.
 *
 * Usage example:
 * ```typescript
 * const idProvider = new IdProvider();
 * const uniqueId = await idProvider.provideNanoId();
 *
 * console.log("Generated ID:", uniqueId);
 * // Generated ID:R6RJQPHJFGKDNV0ah
 * ```
 */
export class IdProvider {
  /**
   * The alphabet set used for generating the IDs. Can be customized via the constructor.
   */
  private _alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz@';

  /**
   * Initializes a new instance of the IdProvider class.
   *
   * @param alphabet Optional custom alphabet for ID generation. If not provided, a default set is used.
   */
  constructor(alphabet?: string) {
    this._alphabet = alphabet ?? this._alphabet;
  }

  /**
   * Imports and provides access to `nanoid` functions: `nanoid`, `customAlphabet`, and `customRandom`.
   * This method dynamically imports the `nanoid` module, which must be installed in the environment.
   *
   * @returns A promise that resolves to the `nanoid` module functions.
   * @throws An error if the `nanoid` module cannot be loaded or is not installed.
   */
  static async imports(): Promise<{
    nanoid: typeof nanoid;
    customAlphabet: typeof customAlphabet;
    customRandom: typeof customRandom;
  }> {
    try {
      const { nanoid, customAlphabet, customRandom } = await import('nanoid');

      return { nanoid, customAlphabet, customRandom };
    } catch (e) {
      console.error(e);
      throw new Error('Failed to load nanoid. Please install nanoid.');
    }
  }

  /**
   * Generates a unique identifier using the custom alphabet set.
   *
   * @param size The length of the generated ID. Default is 17 characters.
   * @returns A promise that resolves to a unique identifier string.
   */
  public async provideNanoId(size: number = 17): Promise<string> {
    const { customAlphabet } = await IdProvider.imports();

    const nanoid = customAlphabet(this._alphabet, size);

    return nanoid();
  }
}

/**
 * Generates a unique identifier (RecordId) using a predefined alphabet and a fixed length.
 * This function uses the `customAlphabet` function from `nanoid` to ensure the ID is unique 
 * and suitable for record identification.
 *
 * Usage example:
 * ```typescript
 * const recordId = getRecordId();
 * 
 * console.log("Generated Record ID:", recordId);
 * // Generated Record ID:JNYep09tEidvz_e0F
 * ```
 *
 * @returns A unique identifier suitable for use as a `RecordId`.
 */
export function getRecordId(): RecordId {
  const _alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz@';
  const nanoid = customAlphabet(_alphabet, 17);

  return nanoid() as RecordId;
}
