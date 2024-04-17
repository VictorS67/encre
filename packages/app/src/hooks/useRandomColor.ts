import { useCallback } from 'react';

import { useRecoilState } from 'recoil';

import { commentColorsState } from '../state/comment';

export function useRandomColor() {
  const [
    { original: originalCommentColor, remaining: remainingCommentColor },
    setCommentColors,
  ] = useRecoilState(commentColorsState);

  const pickRandomCommentColor = useCallback(() => {
    let colorsToPick: string[];
    if (remainingCommentColor.length === 0) {
      setCommentColors({
        original: originalCommentColor,
        remaining: [...originalCommentColor],
      });

      colorsToPick = originalCommentColor;
    } else {
      colorsToPick = remainingCommentColor;
    }

    const randomIndex = Math.floor(Math.random() * colorsToPick.length);
    const pickedColor = colorsToPick[randomIndex];

    setCommentColors({
      original: originalCommentColor,
      remaining: colorsToPick.filter((_, index) => index !== randomIndex),
    });

    return pickedColor;
  }, [originalCommentColor, remainingCommentColor, setCommentColors]);

  return { pickRandomCommentColor };
}
