import { MacOSHotKeys, NonMacOSHotKeys } from '../types/hotkey.type';

function getOS() {
  let osName = 'Unknown';

  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('win') !== -1) {
    osName = 'Windows';
  } else if (userAgent.indexOf('mac') !== -1) {
    osName = 'macOS';
  } else if (userAgent.indexOf('linux') !== -1) {
    osName = 'Linux';
  } else if (userAgent.indexOf('android') !== -1) {
    osName = 'Android';
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    osName = 'iOS';
  }

  return osName;
}
export function useHotKeyDisplay(keys: string[]) {
  const os: string = getOS();

  const hotKeys: string[] = keys.map((k) =>
    os === 'macOS' ? MacOSHotKeys[k] ?? k : NonMacOSHotKeys[k] ?? k,
  );

  return hotKeys.join('+');
}
