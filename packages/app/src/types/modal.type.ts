import React, { ReactElement } from 'react';

import { SerializableNode as Node } from '@encrejs/core/studio/nodes';
import { ConditionUIContext } from '@encrejs/core/studio/ui';

export type BaseModalProps = {
  open: boolean;
  children: ReactElement;
  container?: Element | (() => Element | null) | null;
  disableAutoFocus?: boolean;
  disableEnforceFocus?: boolean;
  disableEscapeKeyDown?: boolean;
  disablePortal?: boolean;
  disableRestoreFocus?: boolean;
  disableScrollLock?: boolean;
  hideBackdrop?: boolean;
  keepMounted?: boolean;
  onClose?: (
    event: NonNullable<unknown>,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => void;
  onTransitionEnter?: () => void;
  onTransitionExited?: () => void;
};

export type ModalProps = Omit<BaseModalProps, 'onClose'> & {
  title?: string;
  description?: string;
  showCloseIcon?: boolean;
  onClose?: (event: React.MouseEvent) => void;
};

export type ConditionEditorModalProps = {
  open: boolean;
  node: Node;
  uiContext: ConditionUIContext;
  editingId: string;
  onClose?: (event: React.MouseEvent) => void;
};
