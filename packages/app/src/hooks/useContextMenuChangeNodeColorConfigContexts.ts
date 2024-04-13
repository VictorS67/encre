import { css } from '@emotion/react';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { useRecoilValue } from 'recoil';

import { commentColorsState } from '../state/comment';

export function useContextMenuChangeNodeColorConfigContexts() {
  const { original, remaining } = useRecoilValue(commentColorsState);

  return [
    {
      id: 'change-node-color:default',
      name: 'default',
      data: {
        colorType: 'default',
      },
      icon: {
        icon: SquareRoundedIcon,
        height: '12px',
        width: '12px',
        fontSize: '12px',
        additionalStyles: css`
          color: transparent;
          background-color: var(--node-background-color);
          border: 2px solid var(--primary-color);
          border-radius: 2px;
        `,
      },
    },
    ...original.map((color) => ({
      id: `change-node-color:${color}`,
      name: color,
      data: {
        colorType: color,
      },
      icon: {
        icon: SquareRoundedIcon,
        height: '12px',
        width: '12px',
        fontSize: '12px',
        additionalStyles: css`
          color: transparent;
          background-color: var(--node-background-${color}-color);
          border: 2px solid var(--primary-color);
          border-radius: 2px;
        `,
      },
    })),
  ];
}
