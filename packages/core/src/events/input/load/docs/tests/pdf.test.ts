import path from 'path';
import url from 'url';
import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { FileProvider } from '../../../../output/provide/file';
import { Context } from '../context';
import { PDFLoader } from '../pdf';

test('test PDF loader from file', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const provider = new FileProvider(filePath);
  const loader = new PDFLoader();

  const serializedStr: string = JSON.stringify(loader, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const docs: Context[] = await loader.load(provider.provide());

  expect(docs.length).toBe(9);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');

  expect(await loader.invoke(provider.provide())).toStrictEqual(docs);
});

test('test PDF loader from file to single document', async () => {
  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/NIPS-2014-generative-adversarial-nets-Paper.pdf'
  );

  const provider = new FileProvider(filePath);
  const loader = new PDFLoader({ shouldSplit: false });

  const serializedStr: string = JSON.stringify(loader, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const docs: Context[] = await loader.load(provider.provide());

  expect(docs.length).toBe(1);
  expect(docs[0].pageContent).toContain('Generative Adversarial Nets');

  expect(await loader.invoke(provider.provide())).toStrictEqual(docs);
});
