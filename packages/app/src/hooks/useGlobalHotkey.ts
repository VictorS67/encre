import { useEffect } from 'react';

import { useLatest } from 'ahooks';

export function useGlobalHotkey(
  key: string | string[],
  onKeyDown: (event: KeyboardEvent) => void,
  onKeyUp: (event: KeyboardEvent) => void,
) {
  const latestKeyDown = useLatest(onKeyDown);
  const latestKeyUp = useLatest(onKeyUp);

  useEffect(() => {
    const keys: string[] = Array.isArray(key) ? key : [key];

    const onKeyDownLatest = (e: KeyboardEvent) => {
      if (keys.some((k) => e.code === k)) {
        latestKeyDown.current(e);
      }
    };

    const onKeyUpLatest = (e: KeyboardEvent) => {
      if (keys.some((k) => e.code === k)) {
        latestKeyUp.current(e);
      }
    };

    window.addEventListener('keydown', onKeyDownLatest);
    window.addEventListener('keyup', onKeyUpLatest);

    return () => {
      window.removeEventListener('keydown', onKeyDownLatest);
      window.removeEventListener('keyup', onKeyUpLatest);
    };
  }, [key, onKeyDown, onKeyUp]);
}
