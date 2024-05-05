import React, { cloneElement, FC, ForwardedRef, forwardRef } from 'react';

import styled from '@emotion/styled';
import { FocusTrap, Portal, unstable_useModal as useModal } from '@mui/base';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { css, Fade } from '@mui/material';
import clsx from 'clsx';

import { Icon } from './Icon';
import { useStableCallback } from '../hooks/useStableCallback';
import { BaseModalProps, ModalProps } from '../types/modal.type';

const ModalContent = styled.div`
  text-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  background-color: var(--node-background-color);
  border-radius: 8px;
  border: 1px solid var(--canvas-background-color));
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 24px;
  color: var(--text-color);

  .modal-header {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .modal-title {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
  }

.modal-description {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 400;
    font-size: 12px;
    color: var(--text-color);
  }

  .modal-close-icon {
    padding: 3px;
    border-radius: 3px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    
    &:hover {
      background: var(--node-background-color-1);
    }
  }
`;

const ModalRoot = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBackdrop = styled.div`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const Backdrop = forwardRef<HTMLDivElement, { open?: boolean }>(
  (props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <ModalBackdrop ref={ref} {...other} />
      </Fade>
    );
  },
);

Backdrop.displayName = 'Backdrop';

export const BaseModal = forwardRef<HTMLElement, BaseModalProps>(
  function MyModal(
    {
      open,
      children,
      container,
      disableAutoFocus = false,
      disableEnforceFocus = false,
      disableEscapeKeyDown = false,
      disablePortal = false,
      disableRestoreFocus = false,
      disableScrollLock = false,
      hideBackdrop = false,
      keepMounted = false,
      onClose,
      onTransitionEnter,
      onTransitionExited,
      ...other
    }: BaseModalProps,
    ref: ForwardedRef<HTMLElement>,
  ) {
    const {
      getRootProps,
      getBackdropProps,
      getTransitionProps,
      portalRef,
      isTopModal,
      exited,
      hasTransition,
    } = useModal({
      ...{
        open,
        children,
        container,
        disableAutoFocus,
        disableEnforceFocus,
        disableEscapeKeyDown,
        disablePortal,
        disableRestoreFocus,
        disableScrollLock,
        hideBackdrop,
        keepMounted,
        onClose,
        onTransitionEnter,
        onTransitionExited,
      },
      rootRef: ref,
    });

    const classes = {
      hidden: !open && exited,
    };

    const childProps: {
      onEnter?: () => void;
      onExited?: () => void;
      tabIndex?: string;
    } = {};
    if (children.props.tabIndex === undefined) {
      childProps.tabIndex = '-1';
    }

    // It's a Transition like component
    if (hasTransition) {
      const { onEnter, onExited } = getTransitionProps();
      childProps.onEnter = onEnter;
      childProps.onExited = onExited;
    }

    const rootProps = {
      ...other,
      className: clsx(classes),
      ...getRootProps(other),
    };

    const backdropProps = {
      open,
      ...getBackdropProps(),
    };

    if (!keepMounted && !open && (!hasTransition || exited)) {
      return null;
    }

    return (
      <Portal
        ref={portalRef}
        container={container}
        disablePortal={disablePortal}
      >
        <ModalRoot {...rootProps}>
          {!hideBackdrop ? <Backdrop {...backdropProps} /> : null}
          <FocusTrap
            disableEnforceFocus={disableEnforceFocus}
            disableAutoFocus={disableAutoFocus}
            disableRestoreFocus={disableRestoreFocus}
            isEnabled={isTopModal}
            open={open}
          >
            {cloneElement(children, childProps)}
          </FocusTrap>
        </ModalRoot>
      </Portal>
    );
  },
);

BaseModal.displayName = 'BaseModal';

export const Modal: FC<ModalProps> = (props: ModalProps) => {
  const { open, title, description, showCloseIcon, children, onClose } = props;

  const onCloseIconClick = useStableCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onClose?.(e);
  });

  const onBaseModalClick = onClose
    ? useStableCallback(
        (
          event: NonNullable<unknown>,
          reason: 'backdropClick' | 'escapeKeyDown',
        ) => {
          onClose(event as React.MouseEvent);
        },
      )
    : undefined;

  const baseModalProps: BaseModalProps = {
    ...props,
    onClose: onBaseModalClick,
  };

  return (
    <BaseModal
      // aria-labelledby="transition-modal-title"
      // aria-describedby="transition-modal-description"
      {...baseModalProps}
    >
      <Fade in={open}>
        <ModalContent
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxHeight: '75%',
          }}
        >
          {title && (
            <div>
              {title && (
                <h2 id="transition-modal-title" className="modal-title">
                  {title}
                </h2>
              )}
              {description && (
                <span
                  id="transition-modal-description"
                  className="modal-description"
                >
                  {description}
                </span>
              )}
            </div>
          )}

          {showCloseIcon && onClose && (
            <div className="modal-close-icon" onClick={onCloseIconClick}>
              <Icon
                icon={CloseRoundedIcon}
                height={'20px'}
                width={'20px'}
                fontSize={'20px'}
              />
            </div>
          )}
          {children}
        </ModalContent>
      </Fade>
    </BaseModal>
  );
};
