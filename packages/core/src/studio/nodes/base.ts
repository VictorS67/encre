import {
  RecordId,
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
} from '../../load/keymap.js';
import {
  SerializedCallableFields,
  CallableMap,
  CallableSequence,
} from '../../record/callable.js';
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

/**
 * Abstract base class for implementing node functionality within a system,
 * encapsulating common logic and data for nodes.
 *
 * @template T The specific type of node, extending `SerializableNode`.
 * @template Type The node type identifier, typically a string.
 * @template SubType The subtype identifier for the node, providing further specification.
 */
export abstract class NodeImpl<
  T extends SerializableNode,
  Type extends T['type'] = T['type'],
  SubType extends T['subType'] = T['subType'],
> {
  /**
   * Reference to the serialized node instance.
   */
  readonly node: T;

  /**
   * Key aliases for serializable data fields.
   */
  readonly aliases: SerializedKeyAlias;

  /**
   * Secret keys used in the serializable data.
   */
  readonly secrets: SecretFields;

  /**
   * Keyword arguments associated with the serializable data.
   * @internal
   */
  private _kwargs: DataFields;

  /**
   * Constructs a NodeImpl instance, initializing it with the provided node data.
   * @param node The node data to initialize the instance with.
   */
  constructor(node: T) {
    this.node = node;

    const { aliases, secrets, kwargs } = this.node.data.getAttributes();
    this.aliases = aliases;
    this.secrets = secrets;
    this._kwargs = this._coerceSerializedToData(kwargs);
  }

  /**
   * Retrieves the title of the node, defaulting to the serializable data's name if not set.
   */
  get title(): string {
    return this.node.title ?? this.name;
  }

  /**
   * Retrieves the description of the node, defaulting to an empty string if not set.
   */
  get description(): string {
    return this.node.description ?? '';
  }

  /**
   * Retrieves the unique identifier of the node.
   */
  get id(): RecordId {
    return this.node.id;
  }

  /**
   * Retrieves the type of the node.
   */
  get type(): Type {
    return this.node.type as Type;
  }

  /**
   * Retrieves the subtype of the node.
   */
  get subType(): SubType {
    return this.node.subType as SubType;
  }

  /**
   * Retrieves the registration arguments of the node, if any.
   * This is used for creating the current node.
   */
  get registerArgs(): Record<string, unknown> | undefined {
    return this.node.registerArgs;
  }

  /**
   * Retrieves the name of the node. It is equvalent to the serializable data's name.
   */
  get name(): string {
    return this.node.data._id[this.node.data._id.length - 1];
  }

  /**
   * Retrieves visual information such as position and size of the node.
   */
  get visualInfo(): T['visualInfo'] {
    return this.node.visualInfo;
  }

  /**
   * Retrieves the data associated with the node.
   */
  get data(): T['data'] {
    return this.node.data;
  }

  /**
   * Retrieves the input ports of the node.
   *
   * @remarks
   * It is NOT safe to get actual input ports of the node if the node is in a graph,
   * please use {@link getInputPortDefs} instead.
   */
  get inputs(): T['inputs'] {
    return this.node.inputs;
  }

  /**
   * Retrieves the output ports of the node.
   *
   * @remarks
   * It is NOT safe to get actual output ports of the node if the node is in a graph,
   * please use {@link getOutputPortDefs} instead.
   */
  get outputs(): T['outputs'] {
    return this.node.outputs;
  }

  /**
   * Retrieves or initializes output port sizes.
   */
  get outputSizes(): NodePortSizes {
    return this.node.outputSizes ?? this._initSize();
  }

  /**
   * Retrieves keyword arguments for the serializable data.
   */
  get kwargs(): DataFields {
    return this._kwargs;
  }

  /**
   * Retrieves the runtime allocation for the node, defaulting to 0.
   */
  get runtime(): number {
    return this.node.runtime ?? 0;
  }

  /**
   * Retrieves the memory allocation for the node, defaulting to 0.
   */
  get memory(): number {
    return this.node.memory ?? 0;
  }

  /**
   * Sets a keyword argument for the node.
   * @param key The key of the argument to set.
   * @param value The value to set for the argument.
   */
  setKwarg(key: string, value: unknown): void {
    if (!(key in this._kwargs)) {
      throw new Error(`keyword ${key} does not exist in ${this.title}`);
    }

    this.node.data[key] = value;

    const { kwargs } = this.node.data.getAttributes();
    this._kwargs = this._coerceSerializedToData(kwargs);
  }

  /**
   * Coerces serialized fields to data fields.
   * @param kwargs The serialized fields to coerce.
   * @returns The coerced data fields.
   * @internal
   */
  private _coerceSerializedToData(kwargs: SerializedFields): DataFields {
    return Object.fromEntries(
      Object.entries(kwargs).map(([k, v]) => [k, coerceToData(v)])
    );
  }

  /**
   * Generates definitions for input ports of the node, potentially modifying port requirements based on existing connections.
   *
   * @param connections An array of `NodeConnection` representing current node connections.
   * @param nodeMap A map of node IDs to `SerializableNode` instances, providing context about other nodes in the system.
   * @returns An array of `NodeInputPortDef` detailing the input port configurations.
   */
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

  /**
   * Generates definitions for output ports of the node.
   *
   * @param connections An array of `NodeConnection`, which might be used in future extensions to modify output configurations based on connections.
   * @param nodeMap A map of node IDs to `SerializableNode`, similar to `getInputPortDefs`, can be used for context about connections.
   * @returns An array of `NodeOutputPortDef` detailing the output port configurations.
   */
  getOutputPortDefs(
    connections: NodeConnection[] = [],
    nodeMap: Record<RecordId, SerializableNode> = {}
  ): NodeOutputPortDef[] {
    return this._initPorts(this.outputs);
  }

  /**
   * Validates the provided inputs against the node's required inputs to ensure all necessary
   * data is present and correctly formatted.
   *
   * @param inputs An optional map of process input data keyed by input port names.
   * @returns A boolean indicating whether the provided inputs meet all requirements specified by the node's input configuration.
   */
  validateInputs(inputs?: ProcessInputMap): boolean {
    // check if there is no input requirement
    if (!this.inputs || Object.keys(this.inputs).length === 0) return true;

    // check if there is no given input
    if (!inputs || Object.keys(inputs).length === 0) return false;

    return validateProcessDataFromPorts(inputs, this.inputs);
  }

  /**
   * Abstract method that must be implemented by subclasses to process input data and produce output.
   *
   * @param inputs A map of input data keyed by input port names.
   * @param context An instance of `ProcessContext` providing additional data and operational context.
   * @returns A promise that resolves to a `ProcessOutputMap`, containing the processing results keyed by output port names.
   */
  abstract process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;

  /**
   * Asynchronously constructs a composite body of UI context elements based on the node's
   * secrets and keyword arguments.
   *
   * @returns A promise that resolves to a `NodeBody`, potentially containing multiple `UIContext` elements.
   */
  async getBody(): Promise<NodeBody> {
    const secretUIContexts: UIContext[] = await displayUIFromSecretFields(
      this.secrets
    );
    const kwargsUIContexts: UIContext[] = await displayUIFromDataFields(
      this.kwargs
    );

    return [...secretUIContexts, ...kwargsUIContexts];
  }

  /**
   * Static method to deserialize a node from its serialized representation, handling different
   * node types via dynamic imports based on the type.
   *
   * @param serialized The serialized node data.
   * @param values Optional values to override or provide additional deserialization context.
   * @param registry Optional registry containing node and guardrail registrations.
   * @returns A promise resolving to an instance of `SerializableNode`.
   */
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

    console.log(`node type: ${serialized.type}`);

    switch (serialized.type) {
      case 'graph': {
        const { GraphNodeImpl } = await import('./utility/graph.node.js');
        return GraphNodeImpl.deserialize(serialized, values, registry);
      }
      case 'if': {
        const { IfNodeImpl } = await import('./utility/if.node.js');
        return IfNodeImpl.deserialize(serialized, values, registry);
      }
      case 'input': {
        const { InputNodeImpl } = await import('./utility/input.node.js');
        return InputNodeImpl.deserialize(serialized);
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

  /**
   * Serializes the current node instance to a `SerializedNode`, including connection and
   * process information.
   *
   * @param connections An array of `NodeConnection` representing the node's outgoing connections.
   * @param processInfo Optional information about the node's runtime and memory usage.
   * @returns A promise that resolves to a `SerializedNode` encapsulating the node's current state and configuration.
   */
  async serialize(
    connections: NodeConnection[],
    processInfo?: NodeProcessInfo
  ): Promise<SerializedNode> {
    const outgoingConnections: {
      [key in string]: { toNodeId: RecordId; toPortName: string };
    } = {};

    for (const conn of connections) {
      const { fromNodeId, fromPortName, toNodeId, toPortName } = conn;

      if (fromNodeId === this.id) {
        outgoingConnections[fromPortName] = { toNodeId, toPortName };
      }
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

  /**
   * Initializes default port sizes.
   * @internal
   */
  private _initSize(): NodePortSizes {
    return Object.fromEntries(
      Object.keys(this.outputs ?? {}).map((key: string) => [key, 0])
    );
  }

  /**
   * Initializes port definitions based on the given ports and optional coercion settings.
   * @param ports The ports to initialize.
   * @param portNamesCoerceToOptional Optional array of port names to coerce to optional.
   * @internal
   */
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

/**
 * Represents an implementation of a node that can make callable operations.
 * This class extends the functionality of `NodeImpl` by adding support for callable operations,
 * typically representing nodes that execute some form of external or complex internal function.
 *
 * @template T The specific `CallableNode` type, representing the specific type of node.
 * @template Type The general type category of the node.
 * @template SubType The subtype of the node providing further categorization under the main type..
 */
export abstract class CallableNodeImpl<
  T extends CallableNode,
  Type extends T['type'] = T['type'],
  SubType extends T['subType'] = T['subType'],
> extends NodeImpl<T, Type, SubType> {
  /**
   * Represents metadata associated with the callable node which configures specific behaviors or
   * attributes needed during the node's execution. Those specific behaviors such as {@link CallableMap},
   * {@link CallableSequence}, etcs can store multiple callables within the current callable.
   * @internal
   */
  private _metadata: {
    /**
     * A string indicating the type of callable operation that the node implements, which
     * helps in identifying the processing strategy or the function to be executed.
     */
    type: string;

    /**
     * An optional field that could store serialized callable fields if applicable. This can
     * include configurations specific to the callable operation, such as parameters or
     * execution settings.
     */
    callables?: SerializedCallableFields | undefined;
  };

  /**
   * Initializes a new instance of the `CallableNodeImpl` class.
   *
   * @param node The `CallableNode` data that provides configuration and runtime information.
   */
  constructor(node: T) {
    super(node);

    const { metadata } = this.node.data.getAttributes();
    this._metadata = metadata;
  }

  /**
   * Gets the type of callable operation this node implements.
   *
   * @return The callable type as a string.
   */
  get callableType(): string {
    return this._metadata.type;
  }

  /**
   * Processes the input data before the main callable operation is executed.
   * This method performs any necessary preprocessing on the input data.
   *
   * @param inputs The input data provided to the node.
   * @param context The process context that might contain additional runtime information or utilities.
   * @return A promise resolving to the processed input data that will be used in the main operation.
   * @internal
   */
  protected abstract _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<unknown>;

  /**
   * Processes the raw outputs from the callable operation.
   * This method converts or handles the outputs from the callable operation before they are
   * returned to the caller.
   *
   * @param rawOutputs The raw output data from the callable operation.
   * @param context The process context that might contain additional runtime information or utilities.
   * @return A promise resolving to the final processed outputs as a `ProcessOutputMap`.
   * @internal
   */
  protected abstract _postprocess(
    rawOutputs: unknown,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;

  /**
   * Invokes the callable operation implemented by the node.
   * This method performs the actual callable operation.
   *
   * @param input The input data to the operation.
   * @param options Optional additional options that might affect the operation.
   * @return A promise resolving to the output of the operation.
   */
  abstract invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput>;
}
