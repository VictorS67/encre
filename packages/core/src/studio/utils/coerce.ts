import { match } from 'ts-pattern';
import { Context } from '../../events/input/load/docs/context.js';
import {
  BaseMessageLike,
} from '../../events/input/load/msgs/base.js';
import { HumanMessage } from '../../events/input/load/msgs/human.js';
import { checkMessageRole, convertMessageLikeToMessage, isMessageLike } from '../../events/input/load/msgs/utils.js';
import {
  isSerializedMessage,
  mapSerializedMessageToChatMessage,
} from '../../events/output/provide/message.js';
import {
  Data,
  DataType,
  ScalarData,
  ScalarDataType,
  ValueOf,
  getScalarTypeOf,
  isArrayData,
  isArrayDataType,
  isScalarData,
  toArrayFromScalar,
} from '../data.js';

export function coerceToData(value: unknown): Data {
  const getScalarData = (value: unknown): ScalarData => {
    if (value === undefined) {
      return { type: 'unknown', value: undefined };
    }

    if (value === null) {
      return { type: 'unknown', value: null };
    }

    if (typeof value === 'string') {
      return { type: 'string', value };
    }

    if (typeof value === 'boolean') {
      return { type: 'boolean', value };
    }

    if (typeof value === 'number') {
      return { type: 'number', value };
    }

    if (value instanceof Blob) {
      return { type: 'blob', value };
    }

    if (Context.isContext(value)) {
      return { type: 'context', value };
    }

    if (isMessageLike(value)) {
      return { type: 'chat-message', value };
    }

    if (typeof value === 'object') {
      return { type: 'object', value: value as Record<string, unknown> };
    }

    throw new Error(`Cannot coerce value: ${value}`);
  };

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'unknown[]', value };
    }

    // BaseMessageLike supports an array `[MessageRole, string]`
    if (isMessageLike(value)) {
      return { type: 'chat-message', value };
    }

    if (
      value.every((item) => getScalarData(item)['type'] === getScalarData(value[0])['type'])
    ) {
      const scalarType: ScalarDataType = getScalarData(value[0])['type'];

      return { type: toArrayFromScalar(scalarType), value };
    }

    return { type: 'unknown[]', value };
  }

  return getScalarData(value);
}

export async function coerceTypeOptional<T extends DataType>(
  data: Data | undefined,
  type: T
): Promise<ValueOf<T>['value'] | undefined> {
  if (isArrayDataType(type) && !isArrayData(data)) {
    const coerced = await coerceTypeOptional(data, getScalarTypeOf(type));
    if (coerced === undefined || coerced === null) {
      return coerced as ValueOf<T>['value'] | undefined;
    }

    return [coerced] as ValueOf<T>['value'] | undefined;
  }

  if (
    isArrayDataType(type) &&
    isArrayData(data) &&
    getScalarTypeOf(type) !== getScalarTypeOf(data.type)
  ) {
    return Promise.all(
      data.value.map(
        async (v) =>
          await coerceTypeOptional(
            { type: getScalarTypeOf(data.type), value: v },
            getScalarTypeOf(type)
          )
      )
    ) as ValueOf<T>['value'] | undefined;
  }

  const result = match(type as DataType)
    .with('string', () => coerceToString(data))
    .with('boolean', () => coerceToBoolean(data))
    .with('number', () => coerceToNumber(data))
    .with('context', () => coerceToContext(data)) // message, 
    .with('chat-message', () => coerceToChatMessage(data))
    .with('object', () => coerceToJSONObject(data))
    .with('blob', () => coerceToBlob(data))
    .otherwise(() => {
      if (!data) {
        return undefined;
      }

      if (
        getScalarTypeOf(data.type) === 'unknown' ||
        getScalarTypeOf(type) === 'unknown'
      ) {
        return data.value;
      }

      return expectTypeOptional(data, type);
    });

  return result as ValueOf<T>['value'] | undefined;
}

export async function expectTypeOptional<T extends DataType>(
  data: Data | undefined,
  type: T
): Promise<ValueOf<T>['value'] | undefined> {
  if (!data) {
    return undefined;
  }

  if (
    isArrayDataType(type) &&
    isScalarData(data) &&
    getScalarTypeOf(type) === data.type
  ) {
    return [data.value] as ValueOf<T>['value'] | undefined;
  }

  if (type === 'unknown') {
    return data.value as ValueOf<T>['value'] | undefined;
  }

  if (
    type === 'unknown[]' &&
    isArrayData(data)
  ) {
    return data.value as ValueOf<T>['value'] | undefined;
  }

  if (data.type !== type) {
    throw new Error(`Expect data of type ${type} but instead got ${data.type}`);
  }

  return data.value as ValueOf<T>['value'] | undefined;
}

async function coerceToString(
  data: Data | undefined
): Promise<string | undefined> {
  if (!data || data.value===undefined || data.value===null) return undefined;

  if (isArrayData(data)) {
    return Promise.all(
      data.value.map(
        async (v) =>
          await coerceTypeOptional(
            { type: getScalarTypeOf(data.type), value: v },
            'string'
          )
      )
    ).then((textArr): string =>
      textArr.filter((t) => t !== undefined).join('\n')
    );
  }

  if (data.type === 'string') return data.value;

  if (data.type === 'boolean') return data.value.toString();

  if (data.type === 'number') return data.value.toString();

  if (data.type === 'blob') return data.value.text();

  if (data.type === 'context') return data.value.pageContent;

  if (data.type === 'chat-message')
    return JSON.stringify(
      convertMessageLikeToMessage(data.value).toSerialized(),
      null,
      2
    );

  if (data.value === undefined) {
    return undefined;
  }

  if (data.value === null) {
    return undefined;
  }

  if (typeof data.value === 'object' && !Array.isArray(data.value)) {
    return JSON.stringify(data.value, null, 2);
  }

  if (data.type === 'unknown' || data.type === 'object') {
    const coerced: Data | undefined = await coerceToData(data.value);
    return coerceTypeOptional(coerced, 'string');
  }

  throw new Error('Cannot be coerced to string');
}

async function coerceToBoolean(
  data: Data | undefined
): Promise<boolean | undefined> {
  if (!data || data.value===undefined || data.value===null) return undefined;

  if (isArrayData(data)) {
    return Promise.all(
      data.value.map(
        async (v) =>
          await coerceTypeOptional(
            { type: getScalarTypeOf(data.type), value: v },
            'boolean'
          )
      )
    ).then((boolArr): boolean => boolArr.every((bool) => bool));
  }

  if (data.type === 'string') {
    return data.value.length > 0 && data.value.toLowerCase() !== 'false';
  }

  if (data.type === 'boolean') return data.value;

  if (data.type === 'number') return data.value !== 0;

  if (data.type === 'blob') return data.value.size !== 0;

  if (data.type === 'context') {
    return (
      data.value.pageContent.length > 0 && data.value.pageContent.toLowerCase() !== 'false'
    );
  }

  if (data.type === 'chat-message') {
    if (Array.isArray(data.value)) {
      if (data.value[0] === 'function') {
        return undefined;
      }
      return data.value[1].length > 0;
    }

    if (typeof data.value === 'string') {
      return data.value.length > 0;
    }

    return data.value.coerceToBoolean();
  }

  return !!data.value;
}

async function coerceToNumber(
  data: Data | undefined
): Promise<number | undefined> {
  if (!data || data.value===undefined || data.value===null) return undefined;

  // Array of Data cannot be merged into one number Data.
  if (isArrayData(data)) {
    return undefined;
  }

  function helpParseFloat(value) {
    const fl = parseFloat(value);
    if (Number.isNaN(fl)) {
      return undefined;
    }
    return fl;
  } 

  if (data.type === 'string') return helpParseFloat(data.value);

  if (data.type === 'boolean') return data.value ? 1 : 0;

  if (data.type === 'number') return data.value;

  if (data.type === 'blob') return helpParseFloat(await data.value.text());

  if (data.type === 'context') return helpParseFloat(data.value.pageContent);

  if (data.type === 'chat-message') {
    if (Array.isArray(data.value)) {
      return helpParseFloat(data.value[1]);
    }

    if (typeof data.value === 'string') {
      return helpParseFloat(data.value);
    }

    if (typeof data.value.content === 'string') {
      return helpParseFloat(data.value.content);
    }

    // Does not support for multiple contents in a BaseMessage.
    return undefined;
  }

  if (data.type === 'object') {
    return undefined;
  }

  if (data.type === 'unknown') {
    const coerced: Data | undefined = await coerceToData(data.value);
    return coerceTypeOptional(coerced, 'number');
  }

  return undefined;
}

async function coerceToContext(
  data: Data | undefined
): Promise<Context | undefined> {
  if (!data || data.value===undefined || data.value===null) return undefined;

  // Array of Data cannot be merged into one context Data.
  if (isArrayData(data)) {
    return undefined;
  } 

  if (data.type === 'string') return new Context({ pageContent: data.value.toString() });

  if (data.type === 'boolean') return new Context({ pageContent: data.value.toString() });

  if (data.type === 'number') return new Context({ pageContent: data.value.toString() });

  if (data.type === 'context') return data.value;

  if (data.type === 'chat-message') return undefined;

  if (
    data.type === 'object' &&
    'pageContent' in data.value && 
    typeof data.value.pageContent==='string'
  ) {
    if (
      'metadata' in data.value && 
      typeof data.value.metadata==='object'
    ) {
      return new Context({ pageContent: data.value.pageContent, metadata: data.value.metadata as Record<string, unknown> });
    } else if (
      !('metadata' in data.value)
    ) {
      return new Context({ pageContent: data.value.pageContent });
    }
  } // if pageContent, metadata exist and pageContent is string and metadata(optional/json object)

  if (data.type === 'unknown') {
    const coerced: Data | undefined = await coerceToData(data.value);
    return coerceTypeOptional(coerced, 'context');
  }

  return undefined;
}

async function coerceToChatMessage(
  data: Data | undefined
): Promise<BaseMessageLike | undefined> {
  if (!data || data.value===undefined || data.value===null) return undefined;

  // Array of Data cannot be merged into one chat-message Data.
  if (isArrayData(data)) {
    return undefined;
  }

  if (data.type === 'string') return new HumanMessage(data.value);

  if (data.type === 'boolean') return new HumanMessage(data.value.toString());

  if (data.type === 'number') return new HumanMessage(data.value.toString());

  if (data.type === 'context') return new HumanMessage(data.value.pageContent);

  // if (data.type === 'chat-message') return data.value;
  if (data.type === 'chat-message') return convertMessageLikeToMessage(data.value);

  if (
    data.type === 'object' &&
    'role' in data.value &&
    'json' in data.value &&
    checkMessageRole(data.value.role) &&
    isSerializedMessage(data.value.json)
  ) {
    return mapSerializedMessageToChatMessage(data.value as any);
  }

  if (data.type === 'unknown') {
    const coerced: Data | undefined = await coerceToData(data.value);
    return coerceTypeOptional(coerced, 'chat-message');
  }

  return undefined;
}

async function coerceToJSONObject(
  data: Data | undefined
): Promise<object | undefined> {
  if (!data || data.value === null) {
    return undefined;
  }

  // Anything can be serialized as JSON
  return data.value;
}

async function coerceToBlob(data: Data | undefined): Promise<Blob | undefined> {
  if (!data || data.value === null) {
    return undefined;
  }

  if (data.type === 'blob') {
    return data.value;
  }

  if (data.type === 'string') {
    return new Blob([data.value], {
      type: 'text/plain',
    });
  }

  if (data.type === 'number') {
    return new Blob([data.value.toString()], {
      type: 'text/plain',
    });
  }

  if (data.type === 'boolean') {
    return new Blob([data.value.toString()], {
      type: 'text/plain',
    });
  }

  if (data.type === 'context') {
    return new Blob([data.value.pageContent], {
      type: (data.value.metadata.type as string) || 'text/plain', // how to test previous?
    });
  }

  if (data.type === 'object') {
    return new Blob([JSON.stringify(data.value, null, 2)], {
      type: 'text/plain',
    });
  }

  return undefined;
}
