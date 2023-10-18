import fs from 'fs';
import path from 'path';
import url from 'url';
import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { Context } from '../context';
import { PDFLoader } from '../docs/pdf';

test('test PDF loader from blob', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const loader = new PDFLoader(
    new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' })
  );

  const docs: Context[] = await loader.load();
  expect(docs.length).toBe(9);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');
  expect(stringify(docs[0].metadata)).toMatchSnapshot();
});
