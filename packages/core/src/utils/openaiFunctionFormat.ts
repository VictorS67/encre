import { OpenAI as OpenAIClient } from 'openai';
import { OpenAIFunctionDef } from '../events/inference/chat/llms/openai';

// Types representing the OpenAI function definitions. While the OpenAI client library
// does have types for function definitions, the properties are just Record<string, unknown>,
// which isn't very useful for type checking this formatting code.
export interface FunctionDef extends Omit<OpenAIFunctionDef, 'parameters'> {
  name: string;
  description?: string;
  parameters: ObjectProp;
}

interface ObjectProp {
  type: 'object';
  properties?: {
    [key: string]: Prop;
  };
  required?: string[];
  description?: string;
}

interface AnyOfProp {
  anyOf: Prop[];
  description?: string;
}

interface StringProp {
  type: 'string';
  enum?: string[];
  description?: string;
}

interface NumberProp {
  type: 'number' | 'integer';
  minimum?: number;
  maximum?: number;
  enum?: number[];
  description?: string;
}

interface BooleanProp {
  type: 'boolean';
  description?: string;
}

interface NullProp {
  type: 'null';
  description?: string;
}

interface ArrayProp {
  type: 'array';
  items?: Prop;
  description?: string;
}

type Prop =
  | ObjectProp
  | StringProp
  | NumberProp
  | BooleanProp
  | NullProp
  | ArrayProp;

export function formatFunctionDefs(functions: FunctionDef[]) {
  const lines: string[] = [];

  lines.push('namespace functions {');
  lines.push('');

  for (const func of functions) {
    if (func.description && func.description.length > 0) {
      lines.push(`// ${func.description}`);
    }

    const params: ObjectProp = JSON.parse(JSON.stringify(func.parameters));
    const properties: Record<string, Prop> | undefined = params.properties;

    if (properties && Object.keys(properties).length > 0) {
      lines.push(`type ${func.name} = (_: {`);
      lines.push(formatObjectProperties(params, 0));
      lines.push('}) => any;');
    } else {
      lines.push(`type ${func.name} = () => any;`);
    }
    lines.push('');
  }
  lines.push('} // namespace functions');

  return lines.join('\n');
}

function formatObjectProperties(params: ObjectProp, indent: number) {
  const properties: Record<string, Prop> | undefined = params.properties;

  if (!properties || Object.keys(properties).length === 0) {
    return '';
  }

  const requiredParams: string[] | undefined = params.required;

  const lines: string[] = [];
  for (const key of Object.keys(properties)) {
    const props: Prop = properties[key];
    const description: string | undefined = props.description;

    if (description && description.length > 0) {
      lines.push(`// ${description}`);
    }

    let question = '?';
    if (
      requiredParams &&
      requiredParams.length > 0 &&
      requiredParams.includes(key)
    ) {
      question = '';
    }
    lines.push(`${key}${question}: ${formatType(props, indent)}`);
  }

  return lines.map((l) => ' '.repeat(Math.max(0, indent)) + l).join('\n');
}

function formatType(props: Prop, indent: number) {
  if (props.type === 'string') {
    if (props.enum) {
      return props.enum.map((v) => `"${v}"`).join(' | ');
    }
    return 'string';
  } else if (props.type === 'array') {
    if (props.items) {
      return `${formatType(props.items, indent)}[]`;
    }
    return 'any[]';
  } else if (props.type === 'object') {
    return `{\n${formatObjectProperties(props, indent + 2)}\n}`;
  } else if (props.type === 'number' || props.type === 'integer') {
    if (props.enum) {
      return props.enum.map((v) => `${v}`).join(' | ');
    }
    return 'number';
  } else if (props.type === 'boolean') {
    return 'boolean';
  } else if (props.type === 'null') {
    return 'null';
  }

  return '';
}
