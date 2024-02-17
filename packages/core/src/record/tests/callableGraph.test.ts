import { expect, jest, test } from '@jest/globals';
import { Callable, CallableConfig } from '../callable.js';
import { CallableGraph } from '../callableGraph.js';
import { CallableNode } from '../callableNode.js';

test('test callable graph is cyclic', async () => {
  class ACallable extends Callable<string, string> {
    _isCallable = true;

    _isSerializable = true;

    _namespace: string[] = ['tests'];

    static _name(): string {
      return 'ACallable';
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

  // We do not allow the callable graph to be cyclic for now.
  // For each time instantiating the callable node, we first add the node
  // to the graph and check if it causes cyclic in graph. If it does, then
  // remove the dependencies and depents of the node.

  const callableA = new ACallable('A');
  const callableB = new ACallable('B');

  jest.spyOn(global.console, 'warn');
  const nodeA = new CallableNode(callableA);
  expect(CallableGraph.getGraph().isCyclic()).toBeFalsy();

  const nodeB = new CallableNode(callableB, [nodeA], [nodeA]);
  expect(CallableGraph.getGraph().isCyclic()).toBeFalsy();

  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenLastCalledWith(
    `CANNOT add callable with id ${nodeB.id} because it cause cyclic in graph.`
  );
});
