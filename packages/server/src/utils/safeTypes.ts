export function strToNum(val?: string): number | undefined {
  if (val === undefined) {
    return undefined;
  }

  const number = Number(val);
  return isNaN(number) ? undefined : number;
}
