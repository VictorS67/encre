import { listen } from 'internal/src/fetch';

export function handleGlobalEvents() {
  listen('server-error', () => {
    console.log('server error occurrs!');
  });
}
