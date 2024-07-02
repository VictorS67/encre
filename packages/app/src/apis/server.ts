import { useCallback } from 'react';

import { useRecoilState } from 'recoil';

import { send } from 'internal/src/fetch';

import { serverURLState } from '../state/settings';

export function useServerURL() {
  const [serverURL, setServerURL] = useRecoilState(serverURLState);

  const setURL = useCallback(
    async (url: string, opts: { validate?: boolean } = {}) => {
      const { error } = await send('set-server-url', { ...opts, url });
      if (!error) {
        setServerURL(await send('get-server-url'));
      }
      return { error };
    },
    [setServerURL],
  );

  return {
    serverURL,
    setServerURL: setURL,
  };
}
