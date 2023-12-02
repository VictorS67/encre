import { Callable, CallableConfig } from './callable.js';
import { CallableGraph } from './callableGraph.js';

export class CallableNode<
  CallInput = unknown,
  CallOutput = unknown,
  CallOptions extends CallableConfig = CallableConfig,
> {
  callable: Callable<CallInput, CallOutput, CallOptions>;

  dependencies: CallableNode<unknown, CallInput>[] = [];

  dependents: CallableNode<CallOutput, unknown>[] = [];

  state: 'pending' | 'running' | 'completed' | 'failed';

  lastResult?: CallOutput;

  error?: Error;

  constructor(
    callable: Callable<CallInput, CallOutput, CallOptions>,
    dependencies: CallableNode<unknown, CallInput>[] = [],
    dependents: CallableNode<CallOutput, unknown>[] = []
  ) {
    this.callable = callable;

    for (const dependency of dependencies) {
      this.addDependency(dependency);
    }

    for (const dependent of dependents) {
      this.addDependent(dependent);
    }

    this.state = 'pending';

    CallableGraph.getGraph().addNode(this);
  }

  addDependency(node: CallableNode<unknown, CallInput>) {
    this.dependencies.push(node);
    node.dependents.push(this);
  }

  addDependent(node: CallableNode<CallOutput, unknown>) {
    node.addDependency(this);
  }

  isReady(): boolean {
    return this.dependencies.every((dep) => dep.state === 'completed');
  }

  async invoke(input: CallInput, options: CallOptions): Promise<CallOutput> {
    this.state = 'running';

    try {
      this.lastResult = await this.callable.invoke(input, options);
      this.state = 'completed';
      return this.lastResult;
    } catch (e) {
      this.state = 'failed';
      this.error = e as Error;
      throw e;
    }
  }
}
