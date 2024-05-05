import React, { FC } from 'react';

import styled from '@emotion/styled';
import { useToggle } from 'ahooks';
import clsx from 'clsx';

import { GuardrailCardProps } from '../types/guardrail.type';

const GuardrailCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--node-foreground-color);
  border: 1.5px solid var(--primary-color);
  border-radius: 8px;
  padding: 10px;
  height: 80px;
  gap: 10px;

  .guardrail-card-header {
    display: inline-flex;
    gap: 10px;
  }

  .guardrail-card-type {
    flex-shrink: 1;
    display: flex;
    padding: 0px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    border: 1px solid var(--text-color-accent-4);
    background: var(--node-foreground-color);

    color: var(--text-color-accent-4);
    text-transform: uppercase;
    word-wrap: break-word;
  }

  .guardrail-card-title {
    flex-grow: 1;
    color: var(--text-color);
    font-size: 16px;
    font-weight: 700;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    hyphens: auto;
  }

  .guardrail-card-select-tag {
    display: inline-flex;
    border: 1px solid var(--text-disabled-color);
    border-radius: 4px;
    cursor: pointer;
    padding: 2px 3px;
    color: var(--text-color);
    gap: 3px;
    align-items: center;
  }

  .guardrail-card-select-box {
    border: 1.5px solid var(--text-color);
    border-radius: 4px;
    width: 14px;
    height: 14px;
    background: var(--node-background-color);
    color: var(--text-color);
    font-size: 11px;
    font-weight: 700;
    diaplay: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .guardrail-card-select-box.selected {
    border: 1.5px solid var(--node-background-color);
    background: var(--text-color);
    color: var(--node-background-color);
  }

  .gaurdrail-card-description {
    font-size: 14px;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    hyphens: auto;
  }
`;

export const GurdrailCard: FC<GuardrailCardProps> = ({
  guardrail,
  selectedIndex,
  onGuardrailToggle,
}: GuardrailCardProps) => {
  const [isGuardrailSelected, { toggle: toggleGuardrail }] = useToggle(
    selectedIndex !== undefined,
  );

  const onGuardrailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onGuardrailToggle?.(guardrail, isGuardrailSelected);
    toggleGuardrail();
  };

  return (
    <GuardrailCardContainer>
      <div className="guardrail-card-header">
        <div className="guardrail-card-type">
          <pre className="pre-wrap">{guardrail.type}</pre>
        </div>
        <div className="guardrail-card-title">{guardrail.name}</div>
        <div className="guardrail-card-select-tag" onClick={onGuardrailClick}>
          <span>Select</span>
          <div
            className={clsx('guardrail-card-select-box', {
              selected: isGuardrailSelected,
            })}
          >
            {isGuardrailSelected && <code>{selectedIndex}</code>}
          </div>
        </div>
      </div>
      <div className="gaurdrail-card-description">{guardrail.detail}</div>
    </GuardrailCardContainer>
  );
};
