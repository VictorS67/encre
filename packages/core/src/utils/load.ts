import * as yaml from 'yaml';

export type FileLoader<T> = (
  file: string,
  path: string,
  values: Record<string, unknown>,
  ...args
) => Promise<T>;

export const loadFromFile = async <T>(
  uri: string,
  loader: FileLoader<T>,
  values: Record<string, unknown> = {},
  ...args
): Promise<T> => {
  try {
    const fs = await import('node:fs/promises');
    return loader(
      await fs.readFile(uri, { encoding: 'utf-8' }),
      uri,
      values,
      ...args
    );
  } catch (e) {
    console.error(e);
    throw new Error(`Could not load file at ${uri}`);
  }
};

export const loadFileContents = (contents: string, format: string) => {
  switch (format) {
    case '.json':
      return JSON.parse(contents);
    case '.encre':
    case '.yml':
    case '.yaml':
      return yaml.parse(contents);
    default:
      throw new Error(`Unsupported filetype ${format}`);
  }
};
