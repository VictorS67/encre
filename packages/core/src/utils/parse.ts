import { loadFileContents } from './load.js';

export const extname = (path: string) => `.${path.split('.').pop()}`;

export const parseFile = (
  file: string,
  path: string,
  supportedTypes?: string[]
) => {
  const suffix = extname(path);

  if (
    !['.json', '.yaml', '.yml', '.encre'].includes(suffix) ||
    (supportedTypes && !supportedTypes.includes(suffix))
  ) {
    throw new Error(`Unsupport file type ${suffix}`);
  }

  return loadFileContents(file, suffix);
};
