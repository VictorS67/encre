// This file is generated by `scripts/create-entrypoints.js`. DO NOT edit manually.

export interface OptionalImportMap {
  'record/callable'?:
    | typeof import('./record/callable.js')
    | Promise<typeof import('./record/callable.js')>;
  'cache'?:
    | typeof import('./cache/index.js')
    | Promise<typeof import('./cache/index.js')>;
  'cache/base'?:
    | typeof import('./cache/base.js')
    | Promise<typeof import('./cache/base.js')>;
  'events/input/load/docs/base'?:
    | typeof import('./events/input/load/docs/base.js')
    | Promise<typeof import('./events/input/load/docs/base.js')>;
  'events/input/load/docs/buffer'?:
    | typeof import('./events/input/load/docs/buffer.js')
    | Promise<typeof import('./events/input/load/docs/buffer.js')>;
  'events/input/load/docs/pdf'?:
    | typeof import('./events/input/load/docs/pdf.js')
    | Promise<typeof import('./events/input/load/docs/pdf.js')>;
  'events/input/load/msgs/base'?:
    | typeof import('./events/input/load/msgs/base.js')
    | Promise<typeof import('./events/input/load/msgs/base.js')>;
  'events/input/load/prompts/base'?:
    | typeof import('./events/input/load/prompts/base.js')
    | Promise<typeof import('./events/input/load/prompts/base.js')>;
  'events/input/load/prompts/chat'?:
    | typeof import('./events/input/load/prompts/chat.js')
    | Promise<typeof import('./events/input/load/prompts/chat.js')>;
  'events/output/provide/base'?:
    | typeof import('./events/output/provide/base.js')
    | Promise<typeof import('./events/output/provide/base.js')>;
  'events/output/provide/file'?:
    | typeof import('./events/output/provide/file.js')
    | Promise<typeof import('./events/output/provide/file.js')>;
  'events/output/provide/llmresult'?:
    | typeof import('./events/output/provide/llmresult.js')
    | Promise<typeof import('./events/output/provide/llmresult.js')>;
  'events/output/provide/message'?:
    | typeof import('./events/output/provide/message.js')
    | Promise<typeof import('./events/output/provide/message.js')>;
}

export interface SecretMap {
  OPENAI_API_KEY?: string;
  OPENAI_ORGANIZATION?: string;
}