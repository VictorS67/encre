import React, { FC } from 'react';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { EditorModalProps } from '../types/editor.type';

export const EditorModal: FC<EditorModalProps> = ({
  open,
  Header,
  Body,
  Footer,
  onClose,
}: EditorModalProps) => {
  return (
    <ModalTransition>
      {open && (
        <Modal width={'x-large'} onClose={onClose}>
          {Header && <Header />}
          <ModalBody>
            <p>AAA</p>
          </ModalBody>
          {Footer && <Footer />}
        </Modal>
      )}
    </ModalTransition>
  );
};
