export function getEnvironmentVariables(name: string): string | undefined {
  try {
    return typeof process !== 'undefined' ? process.env?.[name] : undefined;
  } catch (e) {
    return undefined;
  }
}
