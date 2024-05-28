import { Serializable } from '../load/serializable.js';
import { Data, DataFields, DataType } from './data.js';
import { coerceToData } from './utils/coerce.js';

export class BaseInput extends Serializable {
  _isSerializable = true;

  _namespace: string[] = ['studio', 'input'];

  readonly dataTypes: Record<string, DataType | Readonly<DataType[]>>;

  data: DataFields | undefined;

  readonly variables: string[];

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
