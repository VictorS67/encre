export enum HOTKEY {
  CTRL = 'ctrl',
  SHIFT = 'shift',
  ALT = 'alt',
}

const MacOSHotKeys: Record<string, string> = {
  ctrl: '⌘',
  shift: '⇧',
  alt: '⌥',
};

const NonMacOSHotKeys: Record<string, string> = {
  ctrl: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
};

export { MacOSHotKeys, NonMacOSHotKeys };
