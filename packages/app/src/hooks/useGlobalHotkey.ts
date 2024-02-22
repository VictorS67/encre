import { useEffect } from 'react';

import { useLatest } from 'ahooks';

export function useGlobalHotkey(
  key: string,
  onKeyDown: (event: KeyboardEvent) => void,
  onKeyUp: (event: KeyboardEvent) => void,
) {
  const latestKeyDown = useLatest(onKeyDown);
  const latestKeyUp = useLatest(onKeyUp);

  useEffect(() => {
    const onKeyDownLatest = (e: KeyboardEvent) => {
      if (e.code === key) {
        latestKeyDown.current(e);
      }
    };

    const onKeyUpLatest = (e: KeyboardEvent) => {
      if (e.code === key) {
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
