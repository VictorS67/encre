import { globalGuardrailRegistry } from '@encrejs/core/build/studio/registration/guardrails';
import { Guardrail } from '@encrejs/core/studio/guardrails';
import { atom } from 'recoil';

import { RecordId } from '../types/studio.type';

export const selectingGuardrailIdsState = atom<RecordId[]>({
  key: 'selectingGuardrailIdsState',
  default: [],
});

export const registeredGuardrailsState = atom<{ [key in string]: Guardrail }>({
  key: 'registeredGuardrailsState',
  default: Object.fromEntries(
    Object.entries(globalGuardrailRegistry.implsMap).map(([k, v]) => [
      k,
      {
        ...v.init,
      },
    ]),
  ),
});
