import path from 'path';
import url from 'url';
import { expect, test } from '@jest/globals';
import { Context } from '../context';
import { PDFLoader } from '../docs/pdf';

test('test PDF loader from file', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const loader = new PDFLoader(filePath);
  const docs: Context[] = await loader.load();

  expect(docs.length).toBe(9);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');
});

test('test PDF loader from file to single document', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs: Context[] = await loader.load();

  expect(docs.length).toBe(1);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');
});
