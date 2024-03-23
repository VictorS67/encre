import {
  RecordId,
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
} from '../../load/keymap.js';
import { SerializedCallableFields } from '../../record/callable.js';
import { DataFields } from '../data.js';
import {
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
  validateProcessDataFromPorts,
} from '../processor.js';
import { UIContext } from '../ui.js';
import { coerceToData } from '../utils/coerce.js';
import {
  displayUIFromDataFields,
  displayUIFromSecretFields,
} from '../utils/display.js';
import {
  CallableNode,
  NodeBody,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
  SerializableNode,
} from './index.js';

export interface NodeImplConstructor<T extends SerializableNode> {
  new (node: T): NodeImpl<T>;
  create(args?: Record<string, unknown>): T;
}

export abstract class NodeImpl<
  T extends SerializableNode,
  Type extends T['type'] = T['type'],
  SubType extends T['subType'] = T['subType'],
> {
  readonly node: T;

  title: string;

  readonly aliases: SerializedKeyAlias;

  readonly secrets: SecretFields;

  private _kwargs: DataFields;

  constructor(node: T) {
    this.node = node;

    this.title = this.name;

    const { aliases, secrets, kwargs } = this.node.data.getAttributes();
    this.aliases = aliases;
    this.secrets = secrets;
    this._kwargs = this._coerceSerializedToData(kwargs);
  }

  get id(): RecordId {
    return this.node.data.getNodeId();
  }

  get type(): Type {
    return this.node.type as Type;
  }

  get subType(): SubType {
    return this.node.subType as SubType;
  }

  get name(): string {
    return this.node.data._id[this.node.data._id.length - 1];
  }

  get visualInfo(): T['visualInfo'] {
    return this.visualInfo;
  }

  get data(): T['data'] {
    return this.node.data;
  }

  get inputs(): T['inputs'] {
    return this.inputs;
  }

  get outputs(): T['outputs'] {
    return this.outputs;
  }

  get kwargs(): DataFields {
    return this._kwargs;
  }
  
  // TODO: add runtime, memory??

  // TODO: for each connection of this node, get all parent nodeIds and children nodeIds
  
  setKwarg(key: string, value: unknown): void {
    if (!(key in this._kwargs)) {
      throw new Error(`keyword ${key} does not exist in ${this.title}`);
    }

    this.node.data[key] = value;

    const { kwargs } = this.node.data.getAttributes();
    this._kwargs = this._coerceSerializedToData(kwargs);
  }

  private _coerceSerializedToData(kwargs: SerializedFields): DataFields {
    return Object.fromEntries(
      Object.entries(kwargs).map(([k, v]) => [k, coerceToData(v)])
    );
  }

  getInputPortDefs(
    connections: NodeConnection[],
    nodes: Record<RecordId, SerializableNode>
  ): NodeInputPortDef[] {
    return Object.keys(this.inputs ?? {}).map((key: string) => ({
      nodeId: this.id,
      name: key,
      type: this.inputs ? this.inputs[key] : 'unknown',
    }));
  }

  getOutputPortDefs(
    connections: NodeConnection[],
    nodes: Record<RecordId, SerializableNode>
  ): NodeOutputPortDef[] {
    return Object.keys(this.outputs ?? {}).map((key: string) => ({
      nodeId: this.id,
      name: key,
      type: this.outputs ? this.outputs[key] : 'unknown',
    }));
  }

  validateInputs(inputs?: ProcessInputMap): boolean {
    // check if there is no input requirement
    if (!this.inputs || Object.keys(this.inputs).length === 0) return true;

    // check if there is no given input
    if (!inputs || Object.keys(inputs).length === 0) return false;

    return validateProcessDataFromPorts(inputs, this.inputs);
  }

  abstract process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;

  async getBody(): Promise<NodeBody> {
    const secretUIContexts: UIContext[] = await displayUIFromSecretFields(
      this.secrets
    );
    const kwargsUIContexts: UIContext[] = await displayUIFromDataFields(
      this.kwargs
    );

    return [...secretUIContexts, ...kwargsUIContexts];
  }
}

export abstract class CallableNodeImpl<
  T extends CallableNode,
  Type extends T['type'] = T['type'],
  SubType extends T['subType'] = T['subType'],
> extends NodeImpl<T, Type, SubType> {
  private _metadata: {
    type: string;
    callables?: SerializedCallableFields | undefined;
  };

  constructor(node: T) {
    super(node);

    const { metadata } = this.node.data.getAttributes();
    this._metadata = metadata;
  }

  get callableType(): string {
    return this._metadata.type;
  }

  protected abstract _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<unknown>;

  protected abstract _postprocess(
    rawOutputs: unknown,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;

  abstract invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput>;
}
