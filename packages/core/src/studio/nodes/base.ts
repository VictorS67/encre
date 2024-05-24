import {
  RecordId,
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
} from '../../load/keymap.js';
import { SerializedCallableFields } from '../../record/callable.js';
import { isNotNull } from '../../utils/safeTypes.js';
import { DataFields, DataType } from '../data.js';
import { NodeProcessInfo } from '../graph.js';
import {
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
  validateProcessDataFromPorts,
} from '../processor.js';
import { GuardrailRegistration } from '../registration/guardrails.js';
import { NodeRegistration } from '../registration/nodes.js';
import { SerializedNode } from '../serde.js';
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
  NodePortDef,
  NodePortFields,
  NodePortSizes,
  SerializableNode,
} from './index.js';

export abstract class NodeImpl<
  T extends SerializableNode,
  Type extends T['type'] = T['type'],
  SubType extends T['subType'] = T['subType'],
> {
  readonly node: T;

  readonly aliases: SerializedKeyAlias;

  readonly secrets: SecretFields;

  private _kwargs: DataFields;

  constructor(node: T) {
    this.node = node;

    const { aliases, secrets, kwargs } = this.node.data.getAttributes();
    this.aliases = aliases;
    this.secrets = secrets;
    this._kwargs = this._coerceSerializedToData(kwargs);
  }

  get title(): string {
    return this.node.title ?? this.name;
  }

  get description(): string {
    return this.node.description ?? '';
  }

  get id(): RecordId {
    return this.node.id;
  }

  get type(): Type {
    return this.node.type as Type;
  }

  get subType(): SubType {
    return this.node.subType as SubType;
  }

  get registerArgs(): Record<string, unknown> | undefined {
    return this.node.registerArgs;
  }

  get name(): string {
    return this.node.data._id[this.node.data._id.length - 1];
  }

  get visualInfo(): T['visualInfo'] {
    return this.node.visualInfo;
  }

  get data(): T['data'] {
    return this.node.data;
  }

  get inputs(): T['inputs'] {
    return this.node.inputs;
  }

  get outputs(): T['outputs'] {
    return this.node.outputs;
  }

  get outputSizes(): NodePortSizes {
    return this.node.outputSizes ?? this._initSize();
  }

  get kwargs(): DataFields {
    return this._kwargs;
  }

  get runtime(): number {
    return this.node.runtime ?? 0;
  }

  get memory(): number {
    return this.node.memory ?? 0;
  }

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
    connections: NodeConnection[] = [],
    nodeMap: Record<RecordId, SerializableNode> = {}
  ): NodeInputPortDef[] {
    // If there is a IfNode connected to the current node, then the
    // connected corresponding ports can be coerced to optional (i.e. unknown)
    const portNamesCoerceToOptional: string[] = connections
      .filter((conn) => {
        const node = nodeMap[conn.fromNodeId];

        return (
          conn.toNodeId === this.id && isNotNull(node) && node.type === 'if'
        );
      })
      .map((conn) => conn.toPortName);

    return this._initPorts(this.inputs, portNamesCoerceToOptional);
  }

  getOutputPortDefs(
    connections: NodeConnection[] = [],
    nodeMap: Record<RecordId, SerializableNode> = {}
  ): NodeOutputPortDef[] {
    return this._initPorts(this.outputs);
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

  static async deserialize(
    serialized: SerializedNode,
    values: Record<string, unknown> = {},
    registry?: {
      nodes?: NodeRegistration;
      guardrails?: GuardrailRegistration;
    }
  ): Promise<SerializableNode> {
    if (serialized._type !== 'node') {
      throw new Error(
        `CANNOT deserialize this type in node: ${serialized._type}`
      );
    }

    switch (serialized.type) {
      case 'graph': {
        const { GraphNodeImpl } = await import('./utility/graph.node.js');
        return GraphNodeImpl.deserialize(serialized, values, registry);
      }
      case 'if': {
        const { IfNodeImpl } = await import('./utility/if.node.js');
        return IfNodeImpl.deserialize(serialized, values, registry);
      }
      case 'splitter': {
        const { SplitterNodeImpl } = await import('./input/splitter.node.js');
        return SplitterNodeImpl.deserialize(serialized);
      }
      case 'prompt': {
        const { PromptNodeImpl } = await import('./input/prompt.node.js');
        return PromptNodeImpl.deserialize(serialized);
      }
      case 'message': {
        const { MessageNodeImpl } = await import('./input/message.node.js');
        return MessageNodeImpl.deserialize(serialized);
      }
      case 'loader': {
        const { LoaderNodeImpl } = await import('./input/loader.node.js');
        return LoaderNodeImpl.deserialize(serialized);
      }
      case 'llm': {
        const { LLMNodeImpl } = await import('./inference/chat/llm.node.js');
        return LLMNodeImpl.deserialize(serialized);
      }
      case 'chatlm': {
        const { ChatLMNodeImpl } = await import(
          './inference/chat/chatlm.node.js'
        );
        return ChatLMNodeImpl.deserialize(serialized);
      }
      default:
        throw new Error('Plugin node is unsupported for now');
    }
  }

  async serialize(
    connections: NodeConnection[],
    processInfo?: NodeProcessInfo
  ): Promise<SerializedNode> {
    const outgoingConnections: {
      [key in string]: { toNodeId: RecordId; toPortName: string };
    } = {};

    for (const conn of connections) {
      const { fromPortName, toNodeId, toPortName } = conn;
      outgoingConnections[fromPortName] = { toNodeId, toPortName };
    }

    return {
      _type: 'node',
      id: this.id,
      type: this.type,
      subType: this.subType,
      registerArgs: this.registerArgs,
      title: this.title,
      description: this.description,
      runtime: processInfo?.runtime ?? this.runtime,
      memory: processInfo?.memory ?? this.memory,
      data: JSON.parse(JSON.stringify(this.data)),
      visualInfo: this.visualInfo,
      inputs: this.inputs,
      outputs: this.outputs,
      outputSizes: this.outputSizes,
      outgoingConnections,
    };
  }

  private _initSize(): NodePortSizes {
    return Object.fromEntries(
      Object.keys(this.outputs ?? {}).map((key: string) => [key, 0])
    );
  }

  private _initPorts(
    ports: NodePortFields | undefined,
    portNamesCoerceToOptional: string[] = []
  ): NodePortDef[] {
    return Object.entries(ports ?? {}).map(([key, type]) => {
      const types: DataType[] = Array.isArray(type) ? type : [type];
      if (
        portNamesCoerceToOptional.includes(key) &&
        !types.includes('unknown')
      ) {
        types.push('unknown');
      }

      return {
        nodeId: this.id,
        name: key,
        type: types,
        required: !types.includes('unknown'),
      };
    });
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
