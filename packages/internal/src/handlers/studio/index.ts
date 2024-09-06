export interface StudioHandlers {
  test: () => Promise<string>;
  test2: (arg: { msg: string }) => Promise<string>;
  "test-create-node": (arg: {
    nodeType: string;
    nodeSubType: string;
    registerArgs?: string;
  }) => Promise<string>;
}
