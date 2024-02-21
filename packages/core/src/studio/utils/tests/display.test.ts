import { describe, expect, test } from '@jest/globals';
import { Context } from '../../../events/input/load/docs/context.js';
import {
  BotMessage,
  HumanMessage,
} from '../../../events/input/load/msgs/base.js';
import { SecretFields } from '../../../load/keymap.js';
import { DataFields } from '../../data.js';
import {
  BlobUIContext,
  CodeUIContext,
  ContextUIContext,
  MarkdownUIContext,
  MessageUIContext,
  PlainUIContext,
  UIContext,
} from '../../ui.js';
import {
  displayUIFromDataFields,
  displayUIFromSecretFields,
} from '../display.js';

describe('display UI contexts from key arguments', () => {
  const noData: DataFields = {};

  const onlyKeywords: DataFields = {
    attr1: undefined,
    attr2: undefined,
    attr3: undefined,
    attr4: undefined,
    attr5: undefined,
  };

  const oneValidKeyword: DataFields = {
    attr1: undefined,
    attr2: undefined,
    attr3: { type: 'string', value: '3' },
    attr4: undefined,
    attr5: undefined,
  };

  const plainToMarkdown: DataFields = {
    key: { type: 'string', value: '::markdown\n## TITLE...' },
    word: undefined
  };

  const hideKeyword: DataFields = {
    key: { type: 'string', value: '::markdown\n## TITLE...' },
  };

  const blob = new Blob(['7']);

  const onlyScalars: DataFields = {
    attr1: { type: 'string', value: '1' },
    attr2: { type: 'number', value: 2 },
    attr3: { type: 'boolean', value: true },
    attr4: { type: 'object', value: { sub1: 1, sub2: '2' } },
    attr5: { type: 'unknown', value: undefined },
    attr6: {
      type: 'context',
      value: new Context({ pageContent: '6', metadata: { sub1: 1 } }),
    },
    attr7: { type: 'blob', value: blob },
    attr8: { type: 'chat-message', value: new HumanMessage('8') },
  };

  const blob2 = new Blob(['8']);

  const onlyArrays: DataFields = {
    attr1: { type: 'string[]', value: ['1', '2'] },
    attr2: { type: 'number[]', value: [2, 3] },
    attr3: { type: 'boolean[]', value: [true, false] },
    attr4: {
      type: 'object[]',
      value: [
        { sub1: 1, sub2: '2' },
        { sub3: 3, sub4: '4' },
      ],
    },
    attr5: { type: 'unknown[]', value: [undefined, undefined] },
    attr6: {
      type: 'context[]',
      value: [
        new Context({ pageContent: '6', metadata: { sub1: 1 } }),
        new Context({ pageContent: '7', metadata: { sub1: 2 } }),
      ],
    },
    attr7: { type: 'blob[]', value: [blob, blob2] },
    attr8: {
      type: 'chat-message[]',
      value: [new HumanMessage('8'), new BotMessage('9')],
    },
  };

  const mixedData: DataFields = {
    attr1: { type: 'string', value: '1' },
    attr2: { type: 'number[]', value: [2, 3] },
    attr3: { type: 'boolean', value: true },
    attr4: {
      type: 'object[]',
      value: [
        { sub1: 1, sub2: '2' },
        { sub3: 3, sub4: '4' },
      ],
    },
    attr5: { type: 'unknown', value: undefined },
    attr6: {
      type: 'context[]',
      value: [
        new Context({ pageContent: '6', metadata: { sub1: 1 } }),
        new Context({ pageContent: '7', metadata: { sub1: 2 } }),
      ],
    },
    attr7: { type: 'blob', value: blob },
    attr8: {
      type: 'chat-message[]',
      value: [new HumanMessage('8'), new BotMessage('9')],
    },
  };

  test('noData', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(noData);

    expect(uiContexts).toStrictEqual([]);
  });

  test('onlyKeywords', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(onlyKeywords);

    expect(uiContexts).toStrictEqual([]);
  });

  test('oneValidKeyword', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(oneValidKeyword);

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: 'attr3: "3"',
        language: 'encre-code',
        keywords: ['attr1', 'attr2', 'attr3', 'attr4', 'attr5'],
        isHoldingValues: false
      } as CodeUIContext,
    ]);
  });

  test('plainToMarkdown', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(plainToMarkdown);

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: 'key:',
        language: 'encre-code',
        keywords: ['key', 'word'],
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'markdown',
        text: '## TITLE...',
      } as MarkdownUIContext,
    ]);
  });

  test('hideKeyword', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(hideKeyword);

    expect(uiContexts).toStrictEqual([
      {
        type: 'markdown',
        text: '## TITLE...',
      } as MarkdownUIContext,
    ]);
  });

  test('onlyScalars', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(onlyScalars);

    const language = 'encre-code';
    const keywords = [
      'attr1',
      'attr2',
      'attr3',
      'attr4',
      'attr5',
      'attr6',
      'attr7',
      'attr8',
    ];

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: `attr1: "1"
attr2: 2
attr3: true
attr4: {
  "sub1": 1,
  "sub2": "2"
}
attr6:`,
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'context',
        text: '6',
        metadata: { sub1: 1 },
      } as ContextUIContext,
      {
        type: 'code',
        text: 'attr7:',
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'blob',
        blob: blob,
        size: 1,
        blobType: '',
      } as BlobUIContext,
      {
        type: 'code',
        text: 'attr8:',
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'message',
        text: '8',
        role: 'human',
        name: undefined,
        additionalKwargs: undefined,
      } as MessageUIContext,
    ]);
  });

  test('onlyArrays', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(onlyArrays);

    const language = 'encre-code';
    const keywords = [
      'attr1',
      'attr2',
      'attr3',
      'attr4',
      'attr5',
      'attr6',
      'attr7',
      'attr8',
    ];

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: `attr1: [
  "1",
  "2"
]
attr2: [2, 3]
attr3: [true, false]
attr4: [
  {
    "sub1": 1,
    "sub2": "2"
  },
  {
    "sub3": 3,
    "sub4": "4"
  }
]
attr5: [
  undefined,
  undefined
]
attr6:`,
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'context',
        text: '6',
        metadata: { sub1: 1 },
      } as ContextUIContext,
      {
        type: 'context',
        text: '7',
        metadata: { sub1: 2 },
      } as ContextUIContext,
      {
        type: 'code',
        text: 'attr7:',
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'blob',
        blob: blob,
        size: 1,
        blobType: '',
      } as BlobUIContext,
      {
        type: 'blob',
        blob: blob2,
        size: 1,
        blobType: '',
      } as BlobUIContext,
      {
        type: 'code',
        text: 'attr8:',
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'message',
        text: '8',
        role: 'human',
        name: undefined,
        additionalKwargs: undefined,
      } as MessageUIContext,
      {
        type: 'message',
        text: '9',
        role: 'assistant',
        name: undefined,
        additionalKwargs: undefined,
      } as MessageUIContext,
    ]);
  });

  test('mixedData', async () => {
    const uiContexts: UIContext[] = displayUIFromDataFields(mixedData);

    const language = 'encre-code';
    const keywords = [
      'attr1',
      'attr2',
      'attr3',
      'attr4',
      'attr5',
      'attr6',
      'attr7',
      'attr8',
    ];

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: `attr1: "1"
attr2: [2, 3]
attr3: true
attr4: [
  {
    "sub1": 1,
    "sub2": "2"
  },
  {
    "sub3": 3,
    "sub4": "4"
  }
]
attr6:`,
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'context',
        text: '6',
        metadata: { sub1: 1 },
      } as ContextUIContext,
      {
        type: 'context',
        text: '7',
        metadata: { sub1: 2 },
      } as ContextUIContext,
      {
        type: 'code',
        text: 'attr7:',
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'blob',
        blob: blob,
        size: 1,
        blobType: '',
      } as BlobUIContext,
      {
        type: 'code',
        text: 'attr8:',
        language,
        keywords,
        isHoldingValues: true
      } as CodeUIContext,
      {
        type: 'message',
        text: '8',
        role: 'human',
        name: undefined,
        additionalKwargs: undefined,
      } as MessageUIContext,
      {
        type: 'message',
        text: '9',
        role: 'assistant',
        name: undefined,
        additionalKwargs: undefined,
      } as MessageUIContext,
    ]);
  });
});

describe('display UI contexts from secrets', () => {
  const noSecret: SecretFields = {};

  const simpleSecrets: SecretFields = {
    openai_api_key: 'OPENAI_API_KEY',
    google_api_key: 'GOOGLE_API_KEY',
  };

  const complexSecrets: SecretFields = {
    secret1: 'SECRET_1',
    'secret2.sub1': 'SECRET_2_SUB_1',
    'secret2.sub2': 'SECRET_2_SUB_2',
  };

  test('noSecret', async () => {
    const uiContexts: UIContext[] = displayUIFromSecretFields(noSecret);

    expect(uiContexts).toStrictEqual([]);
  });

  test('simpleSecrets', async () => {
    const uiContexts: UIContext[] = displayUIFromSecretFields(simpleSecrets);

    const language = 'encre-code';
    const keywords = ['openai_api_key', 'google_api_key'];

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: `openai_api_key: {{OPENAI_API_KEY}}
google_api_key: {{GOOGLE_API_KEY}}`,
        language,
        keywords,
        isReadOnly: true
      } as CodeUIContext,
    ]);
  });

  test('complexSecrets', async () => {
    const uiContexts: UIContext[] = displayUIFromSecretFields(complexSecrets);

    const language = 'encre-code';
    const keywords = ['secret1', 'secret2.sub1', 'secret2.sub2'];

    expect(uiContexts).toStrictEqual([
      {
        type: 'code',
        text: `secret1: {{SECRET_1}}
secret2.sub1: {{SECRET_2_SUB_1}}
secret2.sub2: {{SECRET_2_SUB_2}}`,
        language,
        keywords,
        isReadOnly: true
      } as CodeUIContext,
    ]);
  });
});
