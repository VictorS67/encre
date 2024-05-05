import React, { FC, useCallback, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { useRecoilState, useRecoilValue } from 'recoil';

import { GurdrailCard } from './GuardrailCard';
import {
  registeredGuardrailsState,
  selectingGuardrailIdsState,
} from '../state/guardrail';
import { GuardrailHubProps } from '../types/guardrail.type';
import { Guardrail } from '../types/studio.type';
import { isNotNull } from '../utils/safeTypes';

const GuardrailHubContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 48%);
  gap: 2%;
  width: 100%;
  overflow: auto;
`;

export const GuardrailHub: FC<GuardrailHubProps> = ({
  onGuardrailSelect,
  onGuardrailUnselect,
}: GuardrailHubProps) => {
  const registeredGuardrails = useRecoilValue(registeredGuardrailsState);
  const [selectingGuardrailIds, setSelectingGuardrailIds] = useRecoilState(
    selectingGuardrailIdsState,
  );
  // const [selectingGuardDisplayData, setSelectingGuardDisplayData] = useState<
  //   Array<{
  //     index: number;
  //     type: string;
  //     name: string;
  //   }>
  // >([]);

  const onGuardrailToggle = useCallback(
    (guardrail: Guardrail, isSelected: boolean) => {
      if (isSelected) {
        setSelectingGuardrailIds((guardrailIds) =>
          guardrailIds.filter((gId) => gId !== guardrail.id),
        );

        onGuardrailUnselect?.(guardrail);
      } else {
        setSelectingGuardrailIds((guardrailIds) => [
          ...guardrailIds,
          guardrail.id,
        ]);

        onGuardrailSelect?.(guardrail);
      }
    },
    [setSelectingGuardrailIds],
  );

  return (
    <GuardrailHubContainer>
      {Object.values(registeredGuardrails).map((g) => {
        const gId: string = g.id;
        const selectingGuardrailIndex: number =
          selectingGuardrailIds.indexOf(gId);
        const selectedIndex: number | undefined =
          selectingGuardrailIndex === -1
            ? undefined
            : selectingGuardrailIndex + 1;

        return (
          <GurdrailCard
            key={gId}
            guardrail={g}
            selectedIndex={selectedIndex}
            onGuardrailToggle={onGuardrailToggle}
          />
        );
      })}
    </GuardrailHubContainer>
  );
};
