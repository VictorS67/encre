import { useRef } from 'react';

import { disconnect } from 'process';

import { useLatest } from 'ahooks';
import { useRecoilValue } from 'recoil';

import { useServerURL } from '../apis/server';
import { serverState, serverURLState } from '../state/settings';

export function useServer(
  options: { onConnect?: () => void; onDisconnect?: () => void } = {},
) {
  const server = useRecoilValue(serverState);
  const { setServerURL } = useServerURL();
  const onConnectLatest = useLatest(options.onConnect ?? (() => {}));

  const connectRef = useRef<(url: string) => void | undefined>();

  connectRef.current = (url: string) => {
    if (!url) {
      url = 'http://localhost:5127';
    }
    setServerURL(url);
    onConnectLatest.current?.();
  };

  return {
    serverState: server,
    connect: (url: string) => {
      connectRef.current?.(url);
    },
  };
}
