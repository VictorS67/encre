import React, { ForwardedRef, forwardRef } from 'react';

import {
  useMergeRefs,
  autoUpdate,
  shift,
  useFloating,
} from '@floating-ui/react';

import { ContextMenuProps } from '../state/contextMenu';

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  function MyContextMenu(
    props: ContextMenuProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const { x, y, context, disabled } = props;

    const { refs, floatingStyles, update } = useFloating({
      placement: 'bottom-start',
      whileElementsMounted: autoUpdate,
      middleware: [shift({ crossAxis: true })],
    });

    const mergedRef = useMergeRefs([ref, refs.setReference]);

    return <div></div>;
  },
);
