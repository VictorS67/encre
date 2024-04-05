import { css } from '@emotion/react';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { useRecoilValue } from 'recoil';

import { commentColorsState } from '../state/comment';

export function useContextMenuChangeCommentColorConfigContexts() {
  const { original, remaining } = useRecoilValue(commentColorsState);

  return original.map((color) => ({
    id: `change-background-color:${color}`,
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
        background-color: var(--comment-background-${color}-color);
        border: 2px solid var(--comment-border-${color}-color);
        border-radius: 2px;
      `,
    },
  }));
}
