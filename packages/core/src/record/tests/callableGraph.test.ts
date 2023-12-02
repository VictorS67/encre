import { expect, test } from '@jest/globals';
import { Callable, CallableConfig } from '../callable.js';
import { CallableGraph } from '../callableGraph.js';
import { CallableNode } from '../callableNode.js';

test('test callable graph is cyclic', async () => {
  class CallableA extends Callable<string, string> {
    _isCallable = true;

    _isSerializable = true;

    _namespace: string[] = ['tests'];

    static _name(): string {
      return 'CallableA';
    }

    constructor(input: string) {
      super({ input });
    }

    async invoke(
      input: string,
      options?: Partial<CallableConfig> | undefined
    ): Promise<string> {
      return input;
    }
  }

  const nodeA = new CallableNode(new CallableA('A'));
  expect(CallableGraph.getGraph().isCyclic()).toBeFalsy();

  const nodeB = new CallableNode(new CallableA('B'), [nodeA], [nodeA]);
  expect(CallableGraph.getGraph().isCyclic()).toBeTruthy();
});
