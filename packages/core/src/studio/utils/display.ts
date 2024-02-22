import { match } from 'ts-pattern';
import { MessageRole } from '../../events/input/load/msgs/base.js';
import { SecretFields } from '../../load/keymap.js';
import {
  BlobData,
  BooleanData,
  ChatMessageData,
  ContextData,
  Data,
  DataFields,
  JSONObjectData,
  NumberData,
  ScalarDataType,
  StringData,
  UnknownData,
  arrayizeData,
  getScalarTypeOf,
  isArrayDataType,
} from '../data.js';
import {
  BlobUIContext,
  CodeUIContext,
  ContextUIContext,
  MarkdownUIContext,
  MessageUIContext,
  PlainUIContext,
  UIContext,
  UIDataTypesMap,
} from '../ui.js';

export function displayUIFromDataFields(dataFields: DataFields): UIContext[] {
  const dataGrp: [string, Data | undefined][] = Object.entries(dataFields);

  const keywords: string[] = Object.keys(dataFields);
  const hideKeyword = keywords.length === 1;

  const partitionedGrp: {
    uiType: UIContext['type'];
    dataGrp: [string, Data][];
  }[] = partitionDataGroup(dataGrp);

  let uiContexts = [] as UIContext[];
  for (let i = 0; i < partitionedGrp.length; i++) {
    const { uiType: currUIType, dataGrp: currGrp } = partitionedGrp[i];

    const currUIContexts: UIContext[] = match(currUIType)
      .with('blob', () =>
        displayBlobUI(currGrp, hideKeyword, 'encre-code', keywords)
      )
      .with('context', () =>
        displayContextUI(currGrp, hideKeyword, 'encre-code', keywords)
      )
      .with('message', () =>
        displayMessageUI(currGrp, hideKeyword, 'encre-code', keywords)
      )
      .otherwise(() =>
        displayStrUI(currGrp, hideKeyword, 'encre-code', keywords)
      );

    if (uiContexts.length > 0 && currUIContexts.length > 0) {
      const prev = uiContexts.pop() as UIContext;
      const next = currUIContexts.shift() as UIContext;

      uiContexts = [
        ...uiContexts,
        ...concatContexts(prev, next),
        ...currUIContexts,
      ];
    } else {
      uiContexts = [...uiContexts, ...currUIContexts];
    }
  }

  return uiContexts;
}

export function displayUIFromSecretFields(secrets: SecretFields): UIContext[] {
  if (Object.keys(secrets).length === 0) {
    return [];
  }

  const keywords: string[] = Object.keys(secrets);

  const text: string = Object.entries(secrets)
    .map(([k, v]) => `${k}: {{${v}}}`)
    .join('\n');

  return [
    {
      type: 'code',
      text,
      language: 'encre-code',
      keywords,
      isReadOnly: true,
    } as CodeUIContext,
  ];
}

function partitionDataGroup(
  dataGrp: [string, Data | undefined][]
): { uiType: UIContext['type']; dataGrp: [string, Data][] }[] {
  const partitionedGrp = [] as {
    uiType: UIContext['type'];
    dataGrp: [string, Data][];
  }[];

  let currGrp = [] as [string, Data][];
  let currUIType: UIContext['type'] | undefined = undefined;
  for (let i = 0; i < dataGrp.length; i++) {
    const [key, data] = dataGrp[i];

    // skip if data is undefined
    if (!data || !data.value) continue;

    // if currGrp is empty or current element is of the same type as the previous one
    // (here we only care about whether the element can be displayed in the same UI (e.g.
    // `PlainUIContext`, `CodeUIContext`, etcs.), add it to the currGrp.
    if (
      currGrp.length === 0 ||
      UIDataTypesMap[data.type] === UIDataTypesMap[currGrp[0][1].type]
    ) {
      currGrp.push([key, data]);
      currUIType = UIDataTypesMap[data.type];
    } else {
      // if the current element is of a different type, push the currGrp to grouped array,
      // and start a new group with the current element.
      if (!currUIType) {
        throw new Error('UI Type is undefined');
      }

      partitionedGrp.push({ uiType: currUIType, dataGrp: currGrp });
      currGrp = [[key, data]];
      currUIType = UIDataTypesMap[data.type];
    }
  }

  // add the last group to the grouped array.
  if (currGrp.length > 0) {
    if (!currUIType) {
      throw new Error('UI Type is undefined');
    }

    partitionedGrp.push({ uiType: currUIType, dataGrp: currGrp });
  }

  return partitionedGrp;
}

function concatContexts(prev: UIContext, next: UIContext): UIContext[] {
  if (
    prev.type === 'code' &&
    next.type === 'code' &&
    !prev.isReadOnly &&
    !next.isReadOnly
  ) {
    return [
      {
        type: 'code',
        text: [prev.text, next.text].join('\n'),
        language: prev.language || next.language,
        keywords: Array.from(
          new Set([...(prev.keywords ?? []), ...(next.keywords ?? [])])
        ),
        isHoldingValues: next.isHoldingValues ?? false,
      } as CodeUIContext,
    ];
  }

  return [prev, next];
}

function stringifyStrArr(type: ScalarDataType, arr: string[]) {
  if (type === 'object' || type === 'unknown') {
    return JSON.stringify(
      arr.map((str) => {
        try {
          return JSON.parse(str);
        } catch (err) {
          return str;
        }
      }),
      null,
      2
    ).replaceAll('"undefined"', 'undefined');
  }

  if (type === 'string') {
    return JSON.stringify(arr, null, 2);
  }

  return `[${arr.join(', ')}]`;
}

function displayStrUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): (PlainUIContext | MarkdownUIContext | CodeUIContext)[] {
  const isValidated: boolean = dataGrp.every(
    ([k, v]) =>
      UIDataTypesMap[v.type] === 'plain' ||
      UIDataTypesMap[v.type] === 'markdown' ||
      UIDataTypesMap[v.type] === 'code'
  );

  if (!isValidated) {
    throw new Error('cannot display UI in strings');
  }

  const uiContexts = [] as (
    | PlainUIContext
    | MarkdownUIContext
    | CodeUIContext
  )[];
  let textArr = [] as string[];

  const popTextToUIContext = (isHoldingValues: boolean) => {
    if (textArr.length > 0) {
      uiContexts.push({
        type: 'code',
        text: textArr.join('\n'),
        language,
        keywords,
        isHoldingValues,
      } as CodeUIContext);

      textArr = [];
    }
  };

  let isHoldingValues = false;
  for (const [key, data] of dataGrp) {
    const type = getScalarTypeOf(data.type);
    const dataArr = arrayizeData(data);

    const strArr: string[] = match(type)
      .with('string', () => (dataArr as StringData[]).map((d) => d.value))
      .with('boolean', () =>
        (dataArr as BooleanData[]).map((d) => d.value.toString())
      )
      .with('number', () =>
        (dataArr as NumberData[]).map((d) => d.value.toString())
      )
      .with('object', () =>
        (dataArr as JSONObjectData[]).map((d) =>
          JSON.stringify(d.value, null, 2)
        )
      )
      .with('unknown', () =>
        (dataArr as UnknownData[]).map((d) =>
          d.value === undefined ? 'undefined' : JSON.stringify(d.value, null, 2)
        )
      )
      .otherwise(() => {
        throw new Error(
          `cannot display UI in strings because of type: ${type}`
        );
      });

    if (UIDataTypesMap[data.type] === 'code') {
      if (isArrayDataType(data.type)) {
        textArr.push(
          `${hideKeyword ? '' : `${key}: `}${stringifyStrArr(type, strArr)}`
        );
        isHoldingValues = false;
      } else {
        if (strArr.length !== 0) {
          const text = strArr[0];

          if (text.startsWith('::markdown')) {
            if (!hideKeyword) {
              textArr.push(`${key}: `);
              isHoldingValues = true;
            }

            popTextToUIContext(isHoldingValues);

            uiContexts.push({
              type: 'markdown',
              text: text.replace(/^::markdown/, '').trim(),
            } as MarkdownUIContext);
          } else {
            textArr.push(
              `${hideKeyword ? '' : `${key}: `}${
                type === 'string' ? `"${text}"` : text
              }`
            );
          }
          isHoldingValues = false;
        }
      }
    } else {
      if (!hideKeyword) {
        textArr.push(`${key}: `);
        isHoldingValues = true;
      }

      popTextToUIContext(isHoldingValues);

      for (const text of strArr) {
        if (text.startsWith('::markdown')) {
          uiContexts.push({
            type: 'markdown',
            text: text.replace(/^::markdown/, '').trim(),
          } as MarkdownUIContext);
        } else if (UIDataTypesMap[data.type] === 'markdown') {
          uiContexts.push({
            type: 'markdown',
            text: text,
          } as MarkdownUIContext);
        } else {
          uiContexts.push({
            type: 'plain',
            text: text,
          } as PlainUIContext);
        }
      }
      isHoldingValues = false;
    }
  }

  popTextToUIContext(isHoldingValues);

  return uiContexts;
}

function displayBlobUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): (BlobUIContext | CodeUIContext)[] {
  const isValidated: boolean = dataGrp.every(
    ([k, v]) => UIDataTypesMap[v.type] === 'blob'
  );

  if (!isValidated) {
    throw new Error('cannot display UI in blobs');
  }

  const uiContexts = [] as (BlobUIContext | CodeUIContext)[];
  for (const [key, data] of dataGrp) {
    const type = getScalarTypeOf(data.type);
    const dataArr = arrayizeData(data);

    const blobArr: {
      blob: Blob;
      size: number;
      blobType: string;
    }[] = match(type)
      .with('blob', () =>
        (dataArr as BlobData[]).map((d) => {
          return {
            blob: d.value,
            size: d.value.size,
            blobType: d.value.type,
          };
        })
      )
      .otherwise(() => {
        throw new Error(`cannot display UI in blobs because of type: ${type}`);
      });

    if (!hideKeyword && blobArr.length !== 0) {
      uiContexts.push({
        type: 'code',
        text: `${key}: `,
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext);
    }

    for (const blob of blobArr) {
      uiContexts.push({
        type: 'blob',
        ...blob,
      } as BlobUIContext);
    }
  }

  return uiContexts;
}

function displayContextUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): (ContextUIContext | CodeUIContext)[] {
  const isValidated: boolean = dataGrp.every(
    ([k, v]) => UIDataTypesMap[v.type] === 'context'
  );

  if (!isValidated) {
    throw new Error('cannot display UI in contexts');
  }

  const uiContexts = [] as (ContextUIContext | CodeUIContext)[];
  for (const [key, data] of dataGrp) {
    const type = getScalarTypeOf(data.type);
    const dataArr = arrayizeData(data);

    const contextArr: {
      text: string;
      metadata?: {
        [key: string]: unknown;
      };
    }[] = match(type)
      .with('context', () =>
        (dataArr as ContextData[]).map((d) => {
          return {
            text: d.value.pageContent,
            metadata: d.value.metadata,
          };
        })
      )
      .otherwise(() => {
        throw new Error(
          `cannot display UI in contexts because of type: ${type}`
        );
      });

    if (!hideKeyword && contextArr.length !== 0) {
      uiContexts.push({
        type: 'code',
        text: `${key}: `,
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext);
    }

    for (const context of contextArr) {
      uiContexts.push({
        type: 'context',
        ...context,
      } as ContextUIContext);
    }
  }

  return uiContexts;
}

function displayMessageUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): (MessageUIContext | CodeUIContext)[] {
  const isValidated: boolean = dataGrp.every(
    ([k, v]) => UIDataTypesMap[v.type] === 'message'
  );

  if (!isValidated) {
    throw new Error('cannot display UI in messages');
  }

  const uiContexts = [] as (MessageUIContext | CodeUIContext)[];
  for (const [key, data] of dataGrp) {
    const type = getScalarTypeOf(data.type);
    const dataArr = arrayizeData(data);

    const msgArr: {
      text: string;
      role: string | MessageRole;
      name?: string;
      additionalKwargs?: {
        [key: string]: unknown;
      };
    }[] = match(type)
      .with('chat-message', () =>
        (dataArr as ChatMessageData[]).map((d) => {
          if (Array.isArray(d.value)) {
            return {
              text: d.value[1],
              role: d.value[0],
            };
          }

          if (typeof d.value === 'string') {
            return {
              text: d.value,
              role: 'human',
            };
          }

          return {
            text:
              typeof d.value.content === 'string'
                ? d.value.content
                : JSON.stringify(d.value.content, null, 2),
            role: d.value._role(),
            name: d.value.name,
            additionalKwargs: d.value.additionalKwargs,
          };
        })
      )
      .otherwise(() => {
        throw new Error(
          `cannot display UI in messages because of type: ${type}`
        );
      });

    if (!hideKeyword && msgArr.length !== 0) {
      uiContexts.push({
        type: 'code',
        text: `${key}: `,
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext);
    }

    for (const msg of msgArr) {
      uiContexts.push({
        type: 'message',
        ...msg,
      } as MessageUIContext);
    }
  }

  return uiContexts;
}
