import { dedent } from 'ts-dedent';

import { NodeBody } from '../types/nodebody.type';
import { Node } from '../types/studio.type';

export function useNodeBody(node: Node): NodeBody {
  const secrets = node.secrets;
  const kwargs = node.kwargs;

  const secretLines = Object.entries(secrets).map(([k, v]) => `${k}: {{${v}}}`);
  const kwargsLines = Object.entries(kwargs)
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => {
      // TODO: requires `expectTypeOptional('string')`
      if (v?.type === 'string') {
        return `${k}: ${v.value}`;
      }
      return `${k}: NOT A STRING`;
    });

  const lines: string[] = [...secretLines, ...kwargsLines];

  const keywords: string[] = [...Object.keys(secrets), ...Object.keys(kwargs)];

  return { type: 'code', text: dedent`${lines.join('\n')}`, keywords };
}
