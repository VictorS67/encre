export type EncreData = {
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'context'
    | 'chat-message'
    | 'object'
    | 'unknown';
  value: unknown;
};
