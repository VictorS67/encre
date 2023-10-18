import path from 'path';
import url from 'url';
import { expect, test } from '@jest/globals';
import { loadInput } from '../base';
import { Context } from '../context';
import { FileProvider } from '../docs/buffer';
import { PDFLoader } from '../docs/pdf';

test('test PDF loader from file', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const provider = new FileProvider(filePath);
  const loader = new PDFLoader<string>();
  const docs: Context[] = await loadInput(loader, provider);

  expect(docs.length).toBe(9);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');
});

test('test PDF loader from file to single document', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const provider = new FileProvider(filePath);
  const loader = new PDFLoader<string>({ splitPages: false });
  const docs: Context[] = await loadInput(loader, provider);

  expect(docs.length).toBe(1);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');
});
