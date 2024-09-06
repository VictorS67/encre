import { match } from 'ts-pattern';
import {
  type ContentLike,
  type MessageRole,
} from '../../events/input/load/msgs/index.js';
import { type SecretFields } from '../../load/keymap.js';
import {
  type ConditionField,
  type ElseConditionField,
  type IfConditionField,
} from '../condition.js';
import {
  type BlobData,
  type BooleanData,
  type ChatMessageData,
  type ContextData,
  type Data,
  type DataFields,
  type JSONObjectData,
  type NumberData,
  type ScalarDataType,
  type StringData,
  type UnknownData,
  arrayizeData,
  getScalarTypeOf,
  isArrayDataType,
} from '../data.js';
import {
  type AudioUIContext,
  type BlobUIContext,
  type CodeUIContext,
  type ContextUIContext,
  type FileUIContext,
  type ImageUIContext,
  type MarkdownUIContext,
  type MessageUIContext,
  type PlainUIContext,
  type UIContext,
  UIDataTypesMap,
  audioTypes,
  fileTypes,
  imageTypes,
  type ConditionUIContext,
  type ConditionUI,
} from '../ui.js';

export async function displayConditionUI(
  sources: string[],
  actions: {
    [target: string]: [IfConditionField, ...ElseConditionField[]];
  }
): Promise<ConditionUIContext[]> {
  const conditionGrp: [string, ConditionField[]][] = Object.entries(actions);

  const uiContexts = [] as ConditionUIContext[];
  for (const [target, conditionFields] of conditionGrp) {
    const conditions: ConditionUI[] = [];
    for (let i = 0; i < conditionFields.length; i++) {
      const cond: ConditionField = conditionFields[i];
      const condUI: ConditionUI =
        cond.type === 'otherwise'
          ? {
              type: cond.type,
              source: cond.source,
            }
          : {
              type: cond.type,
              description: cond.ruleCollection.getCleanDescription(),
              metadata: cond.ruleCollection.serialize(),
              source: cond.source,
            };

      conditions.push(condUI);
    }

    uiContexts.push({
      type: 'condition',
      target,
      sources,
      conditions,
    });
  }

  return uiContexts;
}

export async function displayUIFromDataFields(
  dataFields: DataFields
): Promise<UIContext[]> {
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

    const currUIContexts: UIContext[] = await match(currUIType)
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

export async function displayUIFromSecretFields(
  secrets: SecretFields
): Promise<UIContext[]> {
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
    if (!data) continue;

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

function stringifyStrArr(type: ScalarDataType, arr: string[]): string {
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

function getPlainOrMarkdownFromStr(
  text: string
): PlainUIContext | MarkdownUIContext {
  if (text.startsWith('::markdown')) {
    return {
      type: 'markdown',
      text: text.replace(/^::markdown/, '').trim(),
    } as MarkdownUIContext;
  } else {
    return {
      type: 'plain',
      text: text,
    } as PlainUIContext;
  }
}

function getCodeOrMarkdownFromStr(
  text: string,
  language?: string,
  keywords?: string[]
): CodeUIContext | MarkdownUIContext {
  if (text.startsWith('::markdown')) {
    return {
      type: 'markdown',
      text: text.replace(/^::markdown/, '').trim(),
    } as MarkdownUIContext;
  } else {
    return {
      type: 'code',
      text: `"${text}"`,
      language,
      keywords,
      isHoldingValues: false,
    } as CodeUIContext;
  }
}

async function displayStrUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): Promise<(PlainUIContext | MarkdownUIContext | CodeUIContext)[]> {
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
        if (UIDataTypesMap[data.type] === 'markdown') {
          uiContexts.push({
            type: 'markdown',
            text: text,
          } as MarkdownUIContext);
        } else {
          uiContexts.push(getPlainOrMarkdownFromStr(text));
        }
      }
      isHoldingValues = false;
    }
  }

  popTextToUIContext(isHoldingValues);

  return uiContexts;
}

function getMatchingKnownBlobType(
  blobType: string,
  knownTypes: string[]
): string | undefined {
  for (const type of knownTypes) {
    if (blobType.startsWith(type)) {
      return type;
    }
  }
  return undefined;
}

async function displayBlobUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): Promise<(BlobUIContext | CodeUIContext)[]> {
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
      blob: Array<ImageUIContext | AudioUIContext | FileUIContext>;
      size: number;
      blobType: string;
    }[] = await match(type)
      .with('blob', async () =>
        Promise.all(
          (dataArr as BlobData[]).map(async (d) => {
            const size: number = d.value.size;
            const blobType: string = d.value.type;

            const data: Uint8Array = new Uint8Array(
              await d.value.arrayBuffer()
            );

            if (blobType.startsWith('image/')) {
              const imgType: string | undefined = getMatchingKnownBlobType(
                blobType,
                imageTypes
              );

              return {
                blob: [
                  {
                    type: 'image',
                    mimeType: imgType ?? 'image/png',
                    data,
                  } as ImageUIContext,
                ],
                size,
                blobType,
              };
            } else if (blobType.startsWith('audio/')) {
              const audType: string | undefined = getMatchingKnownBlobType(
                blobType,
                audioTypes
              );

              return {
                blob: [
                  {
                    type: 'audio',
                    mimeType: audType ?? 'audio/mp3',
                    data,
                  } as AudioUIContext,
                ],
                size,
                blobType,
              };
            }

            const fileType: string | undefined = getMatchingKnownBlobType(
              blobType,
              fileTypes
            );

            return {
              blob: [
                {
                  type: 'file',
                  mimeType: fileType ?? 'text/plain',
                  data,
                } as FileUIContext,
              ],
              size,
              blobType,
            };
          })
        )
      )
      .otherwise(async () => {
        throw new Error(`cannot display UI in blobs because of type: ${type}`);
      });

    if (!hideKeyword && blobArr.length !== 0) {
      uiContexts.push({
        type: 'code',
        text: `${key}: `,
        language,
        keywords,
        isHoldingValues: true,
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

async function displayContextUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): Promise<(ContextUIContext | CodeUIContext)[]> {
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
      text: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
      metadata: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
    }[] = match(type)
      .with('context', () =>
        (dataArr as ContextData[]).map((d) => {
          const _metadata = d.value.metadata ?? {};
          const _metadataKeywords = Object.keys(_metadata);
          const _metadataEntries = Object.entries(_metadata);

          return {
            text: [getPlainOrMarkdownFromStr(d.value.pageContent)],
            metadata: [
              {
                type: 'code',
                text: _metadataEntries
                  .map(([k, v]) => `${k}: ${JSON.stringify(v, null, 2)}`)
                  .join('\n'),
                language: 'encre-code',
                keywords: _metadataKeywords,
                isHoldingValues: false,
              } as CodeUIContext,
            ],
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
        isHoldingValues: true,
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

async function displayMessageUI(
  dataGrp: [string, Data][],
  hideKeyword?: boolean,
  language?: string,
  keywords?: string[]
): Promise<(MessageUIContext | CodeUIContext)[]> {
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
      content: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
      kwargs: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
      role: string | MessageRole;
      name?: string;
    }[] = match(type)
      .with('chat-message', () =>
        (dataArr as ChatMessageData[]).map((d) => {
          if (Array.isArray(d.value)) {
            return {
              content: [getPlainOrMarkdownFromStr(d.value[1])],
              kwargs: [],
              role: d.value[0],
            };
          }

          if (typeof d.value === 'string') {
            return {
              content: [getPlainOrMarkdownFromStr(d.value)],
              kwargs: [],
              role: 'human',
            };
          }

          const _kwargs = d.value.additionalKwargs ?? {};
          const _kwargsKeywords = Object.keys(_kwargs);
          const _kwargsEntries = Object.entries(_kwargs);

          const getContentUI = (
            content: ContentLike
          ): PlainUIContext | MarkdownUIContext | CodeUIContext => {
            if (typeof content === 'string') {
              return getPlainOrMarkdownFromStr(content);
            }

            // TODO: Display Image UI Content
            return getPlainOrMarkdownFromStr(JSON.stringify(content, null, 2));
          };

          return {
            content: Array.isArray(d.value.content)
              ? d.value.content.map((c) => getContentUI(c))
              : [getContentUI(d.value.content)],
            kwargs: [
              {
                type: 'code',
                text: _kwargsEntries
                  .map(([k, v]) => `${k}: ${JSON.stringify(v, null, 2)}`)
                  .join('\n'),
                language: 'encre-code',
                keywords: _kwargsKeywords,
                isHoldingValues: false,
              } as CodeUIContext,
            ],
            role: d.value._role(),
            name: d.value.name,
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
        isHoldingValues: true,
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
