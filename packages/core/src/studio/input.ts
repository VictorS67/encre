import { Serializable } from '../load/serializable.js';
import { type Data, type DataFields, type DataType } from './data.js';
import { coerceToData } from './utils/coerce.js';

/**
 * Represents a base class for user or automated inputs, making it a fundamental part of
 * user-interactive or data-driven workflows.
 * @example
 * ```typescript
 * const input = new BaseInput({
 *   dataTypes: { age: 'number', name: 'string' },
 *   data: { age: 25, name: 'Alice' }
 * });
 * ```
 */
export class BaseInput extends Serializable {
  _isSerializable = true;

  _namespace: string[] = ['studio', 'input'];

  /**
   * A record of field names to their expected data types.
   */
  readonly dataTypes: Record<string, DataType | Readonly<DataType[]>>;

  /**
   * An optional map of data fields that may be included in an instance.
   */
  data: DataFields | undefined;

  /**
   * A list of variable names derived from dataTypes.
   */
  readonly variables: string[];

  /**
   * Constructs a new BaseInput instance, validating any initial data against the provided data types.
   *
   * @param fields - Configuration object for initializing the instance.
   * @throws {Error} Throws an error if any data field does not conform to its declared data type.
   *
   */
  constructor(fields: {
    dataTypes: Record<string, DataType | Readonly<DataType[]>>;
    data?: DataFields;
  }) {
    if (fields.data) {
      for (const [k, v] of Object.entries(fields.data)) {
        if (!BaseInput.validateData(k, v, fields.dataTypes)) {
          throw new Error(`Input field ${k} CANNOT be stored`);
        }
      }
    }

    super(fields);

    this.dataTypes = fields.dataTypes;
    this.data = fields.data;
    this.variables = Object.keys(fields.dataTypes);
  }

  /**
   * Creates a new BaseInput instance from raw fields, inferring data types automatically.
   * Optional fields can be specified, which are allowed to also be 'unknown'.
   *
   * @param fields - A record of field names to raw values.
   * @param optional - An array of keys that should be considered optional.
   * @returns {BaseInput} A new instance of BaseInput.
   * @example
   * ```typescript
   * const input = BaseInput.from({
   *   age: 30,
   *   name: 'Bob',
   *   hobby: 'reading'
   * }, ['hobby']);
   *
   * console.log(input.dataTypes);
   * // Outputs: {
   * //   age: 'number',
   * //   name: 'string',
   * //   hobby: ['string', 'unknown']
   * // }
   * ```
   */
  static from(fields: Record<string, unknown>, optional?: string[]): BaseInput {
    const data: DataFields = {};
    const dataTypes: Record<string, DataType | Readonly<DataType[]>> = {};

    for (const [k, v] of Object.entries(fields)) {
      const coercedData: Data = coerceToData(v);

      data[k] = coercedData;
      dataTypes[k] = coercedData.type;

      if (optional?.includes(k)) {
        dataTypes[k] = [...new Set<DataType>([coercedData.type, 'unknown'])];
      }
    }

    return new BaseInput({ dataTypes, data });
  }

  /**
   * Validates a single data field against the expected data type.
   *
   * @param key - The key of the data field to validate.
   * @param value - The value of the data field.
   * @param dataTypes - A record of data types expected for each field.
   * @returns {boolean} True if the data is valid or undefined, false otherwise.
   * @example
   * ```typescript
   * const isValid = BaseInput.validateData('age', { type: 'number', value: 30 }, { age: 'number' });
   * console.log(isValid); // Output: true
   * ```
   */
  static validateData(
    key: string,
    value: Data | undefined,
    dataTypes: Record<string, DataType | Readonly<DataType[]>>
  ): boolean {
    if (!(key in dataTypes)) {
      return false;
    }

    if (!value) {
      return true;
    }

    return value.type === dataTypes[key];
  }
}
