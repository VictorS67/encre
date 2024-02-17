import { RecordId } from '../load/keymap.js';
import { Callable, CallableConfig, CallableLike } from './callable.js';
import { CallableGraph } from './callableGraph.js';

export class CallableNode<
  CallInput = unknown,
  CallOutput = unknown,
  CallOptions extends CallableConfig = CallableConfig,
> {
  callable: Callable<CallInput, CallOutput, CallOptions>;

  id: RecordId;

  dependencies: Map<RecordId, CallableNode<unknown, CallInput>> = new Map();

  dependents: Map<RecordId, CallableNode<CallOutput, unknown>> = new Map();

  state: 'pending' | 'running' | 'completed' | 'failed';

  lastResult?: CallOutput;

  error?: Error;

  constructor(
    callable: Callable<CallInput, CallOutput, CallOptions>,
    dependencies: CallableNode<unknown, CallInput>[] = [],
    dependents: CallableNode<CallOutput, unknown>[] = []
  ) {
    this.callable = callable;
    this.id = callable.getNodeId();

    for (const dependency of dependencies) {
      this.addDependency(dependency);
    }

    for (const dependent of dependents) {
      this.addDependent(dependent);
    }

    this.state = 'pending';

    CallableGraph.getGraph().addNode(this);

    if (CallableGraph.getGraph().isCyclic()) {
      console.warn(
        `CANNOT add callable with id ${this.id} because it cause cyclic in graph.`
      );

      for (const dependency of dependencies) {
        this.removeDependency(dependency);
      }

      for (const dependent of dependents) {
        this.removeDependent(dependent);
      }
    }
  }

  addDependency(node: CallableNode<unknown, CallInput>) {
    this.dependencies.set(node.id, node);
    node.dependents.set(this.id, this);
  }

  addDependent(node: CallableNode<CallOutput, unknown>) {
    node.addDependency(this);
  }

  removeDependency(node: CallableNode<unknown, CallInput>) {
    if (this.dependencies.has(node.id)) {
      this.dependencies.delete(node.id);
    }

    if (node.dependents.has(this.id)) {
      node.dependents.delete(this.id);
    }
  }

  removeDependent(node: CallableNode<CallOutput, unknown>) {
    node.removeDependency(this);
  }

  isReady(): boolean {
    return Array.from(this.dependencies.values()).every(
      (dep) => dep.state === 'completed'
    );
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
