import fs from 'fs';
import path from 'path';
import url from 'url';
import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { loadInput } from '../base';
import { Context } from '../context';
import { FileProvider } from '../docs/buffer';
import { PDFLoader } from '../docs/pdf';

test('test PDF loader from blob', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const provider = new FileProvider(
    new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' })
  );
  const loader = new PDFLoader();
  const docs: Context[] = await loadInput(loader, provider);

  expect(docs.length).toBe(9);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');
  expect(stringify(docs[0].metadata)).toMatchSnapshot();
});
