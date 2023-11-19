import fs from 'node:fs';
import path from 'path';
import url from 'url';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { stringify } from 'yaml';
import { getNumTokens } from '../../../../utils/tokenizer.js';
import { Context } from '../../load/docs/context.js';
import {
  ContextSplitter,
  RecursiveTextSplitter,
  TextSplitter,
  TokenTextSplitter,
} from '../splitter.js';

test('test custom ContextSplitter', async () => {
  class TestSplitter extends ContextSplitter {
    async split(text: string): Promise<string[]> {
      return text.split('');
    }
  }

  const testSplitter = new TestSplitter();

  const serializedStr: string = JSON.stringify(testSplitter, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const context = new Context({
    pageContent: 'a\nb\nc',
  });

  const newContexts = await testSplitter.invoke(context);
  expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
    'a',
    '\n',
    'b',
    '\n',
    'c',
  ]);
  expect(newContexts.map((c) => c.metadata)).toStrictEqual([
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 2 } } },
    { loc: { lines: { from: 2, to: 2 } } },
    { loc: { lines: { from: 2, to: 3 } } },
    { loc: { lines: { from: 3, to: 3 } } },
  ]);
});

test('test TextSplitter', async () => {
  // The TextSplitter does not leverage maxSize and overlap attributes.
  // It only splits the given text based on the separator.
  // The default keepSeparator is false, which means the separator is removed
  // in splitted context.
  // If the splitted context has content length that is larger than the
  // maxSize, then the warning will show up.

  const textSplitter = new TextSplitter({
    maxSize: 3,
    overlap: 1,
    separator: '+++',
    keepSeparator: false,
  });

  const serializedStr: string = JSON.stringify(textSplitter, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const context = new Context({
    pageContent: 'abcd+++b+++c',
  });

  jest.spyOn(global.console, 'warn');
  const newContexts = await textSplitter.invoke(context);

  expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
    'abcd',
    'b',
    'c',
  ]);
  expect(newContexts.map((c) => c.metadata)).toStrictEqual([
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 1 } } },
  ]);

  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenLastCalledWith(
    `Created a chunk with a size of ${
      'abcd'.length
    } which is larger than the max size of ${textSplitter.maxSize}`
  );
});

test('test TextSplitter with separator', async () => {
  // If the keepSeparator is true, then the separator is kept in
  // splitted context.

  const textSplitter = new TextSplitter({
    maxSize: 3,
    overlap: 1,
    separator: '+++',
    keepSeparator: true,
  });

  const context = new Context({
    pageContent: 'abcd+++b+++c',
  });

  const newContexts = await textSplitter.invoke(context);

  expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
    'abcd',
    '+++b',
    '+++c',
  ]);
  expect(newContexts.map((c) => c.metadata)).toStrictEqual([
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 1 } } },
  ]);
});

test('test TextSplitter with newlines separator', async () => {
  // If the separator is newlines, then the separator is removed
  // in the splitted context. The reason for this is that the
  // splitted context is trimed before returning.

  const textSplitter = new TextSplitter({
    maxSize: 3,
    overlap: 1,
    separator: '\n\n\n',
    keepSeparator: true,
  });

  const serializedStr: string = JSON.stringify(textSplitter, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const context = new Context({
    pageContent: 'abcd\n\n\nb\n\n\nc',
  });

  const newContexts = await textSplitter.invoke(context);

  expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
    'abcd',
    'b',
    'c',
  ]);
  expect(newContexts.map((c) => c.metadata)).toStrictEqual([
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 1 } } },
    { loc: { lines: { from: 1, to: 1 } } },
  ]);
});

describe('RecursiveTextSplitter', () => {
  let splitter: RecursiveTextSplitter;

  beforeEach(() => {
    splitter = new RecursiveTextSplitter({
      maxSize: 3,
      overlap: 1,
      separators: ['\n\n', '\n', ' ', ''],
      keepSeparator: true,
    });
  });

  test('should split a simple text without needing recursion', async () => {
    const context = new Context({
      pageContent: 'abcd',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual(['abc', 'cd']);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([
      { loc: { lines: { from: 1, to: 1 } } },
      { loc: { lines: { from: 1, to: 1 } } },
    ]);
  });

  test('should return the entire text as one segment if under maxSize', async () => {
    const context = new Context({
      pageContent: 'ab',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual(['ab']);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([
      { loc: { lines: { from: 1, to: 1 } } },
    ]);
  });

  test('should handle an empty string input', async () => {
    const context = new Context({
      pageContent: '',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([]);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([]);
  });

  test('should correctly use the first applicable separator', async () => {
    const context = new Context({
      pageContent: 'ab\n\ncd',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual(['ab', 'cd']);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([
      { loc: { lines: { from: 1, to: 1 } } },
      { loc: { lines: { from: 3, to: 3 } } },
    ]);
  });

  test('should dynamically remove higher granularity separators after each split', async () => {
    const context = new Context({
      pageContent: 'ab\ncd\n\nef',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'ab',
      'cd',
      'ef',
    ]);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([
      { loc: { lines: { from: 1, to: 1 } } },
      { loc: { lines: { from: 2, to: 2 } } },
      { loc: { lines: { from: 4, to: 4 } } },
    ]);
  });

  test('should recursively split text using nested separators', async () => {
    const context = new Context({
      pageContent: 'abcd\ne\n\nfg\nh',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'abc',
      'cd',
      'e',
      'fg',
      'h',
    ]);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([
      { loc: { lines: { from: 1, to: 1 } } },
      { loc: { lines: { from: 1, to: 1 } } },
      { loc: { lines: { from: 2, to: 2 } } },
      { loc: { lines: { from: 4, to: 4 } } },
      { loc: { lines: { from: 5, to: 5 } } },
    ]);
  });

  test('should ensure that all final splits conform to the size constraints', async () => {
    const context = new Context({
      pageContent: 'abcdefg',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).not.toContain('abcdefg');
  });

  test('should identify and accumulate "good splits"', async () => {
    const context = new Context({
      pageContent: 'a b cd efgh',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toContain('a b');
  });

  test('should merge accumulated "good splits" correctly', async () => {
    splitter.maxSize = 3;
    const context = new Context({
      pageContent: 'a b cd efgh',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'a b',
      'cd',
      'ef',
      'fgh',
    ]);
  });

  test('should handle edge cases where splits are borderline maxSize', async () => {
    splitter.maxSize = 6;
    const context = new Context({
      pageContent: 'a b cd efgh',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'a b cd',
      'efgh',
    ]);
  });

  test('should correctly identify and concatenate overlaps to maintain context', async () => {
    splitter.maxSize = 4;
    splitter.overlap = 2;
    const context = new Context({
      pageContent: 'a b c d e f',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'a b',
      'b c',
      'c d',
      'd e',
      'e f',
    ]);
  });

  test('should handle texts with no natural splitting points', async () => {
    const context = new Context({
      pageContent: 'abcde',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual(['abc', 'cde']);
  });

  test('should maintain performance efficiency with large texts', async () => {
    const filePath: string = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      './examples/long_text.txt'
    );

    const fdr: string = fs.readFileSync(filePath, {
      encoding: 'utf8',
      flag: 'r',
    });

    const context = new Context({
      pageContent: fdr,
    });

    const startTime = Date.now();
    await splitter.invoke(context);
    const endTime = Date.now();
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(1000);
  });

  test('should maintain performance efficiency with large texts for token counting', async () => {
    // The TextSplitter allows to change the function for computing the context size.
    // Here we are using the gpt2 encoding to split the codes. However, it takes longer time
    // since we are fetching for tokens.
    // Thus, we are using the maximum context size for gpt2 model (which is 2048) to limit the
    // context size of the splitter, which is a better fit for the real-world cases.

    splitter.computeContextSize = async (text: string): Promise<number> => {
      return getNumTokens(text, 'gpt2');
    };
    splitter.maxSize = 2048;

    const filePath: string = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      './examples/long_text.txt'
    );

    const fdr: string = fs.readFileSync(filePath, {
      encoding: 'utf8',
      flag: 'r',
    });

    const context = new Context({
      pageContent: fdr,
    });

    const startTime = Date.now();
    await splitter.invoke(context);
    const endTime = Date.now();
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(5000);
  });

  test('should maintain performance efficiency with large texts for token counting', async () => {
    // This is the case when the splitted context that has context size exceeded the maxSize.
    // This is because that the computContextSize first convert the text to tokens then get the
    // length of the tokens. However, the computContextSize may get different token sizes when
    // dealing with truncated context.

    splitter.computeContextSize = async (text: string): Promise<number> => {
      return getNumTokens(text, 'gpt2');
    };
    splitter.maxSize = 3;

    const context = new Context({
      pageContent: 'abcd\ne\n\nfg\nh',
    });

    const newContexts = await splitter.invoke(context);
    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'abcd',
      'e',
      'fg',
      'h',
    ]);
    expect(newContexts.map((c) => c.metadata)).toStrictEqual([
      { loc: { lines: { from: 1, to: 1 } } },
      { loc: { lines: { from: 2, to: 2 } } },
      { loc: { lines: { from: 4, to: 4 } } },
      { loc: { lines: { from: 5, to: 5 } } },
    ]);
  });
});

describe('TokenTextSplitter', () => {
  let splitter: TokenTextSplitter;

  beforeEach(() => {
    splitter = new TokenTextSplitter({
      modelName: 'gpt2',
    });
  });

  test('should correctly tokenize a simple string', async () => {
    splitter.maxSize = 2;
    splitter.overlap = 1;

    const context = new Context({
      pageContent: 'Hello world!',
    });

    const newContexts = await splitter.invoke(context);

    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'Hello world',
      ' world!',
      '!',
    ]);
  });

  test('should correctly handle large text based on maxSize and overlap', async () => {
    splitter.maxSize = 5;
    splitter.overlap = 2;
    const context = new Context({
      pageContent: 'This is a long test string for testing.',
    });

    const newContexts = await splitter.invoke(context);

    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'This is a long test',
      ' long test string for testing',
      ' for testing.',
    ]);
  });

  test('should handle special characters based on allowed and disallowed configurations', async () => {
    splitter.maxSize = 2;
    splitter.overlap = 1;
    splitter.allowedSpecial = ['!'];
    splitter.disallowedSpecial = [];

    const context = new Context({
      pageContent: 'Hello! World?',
    });

    const newContexts = await splitter.invoke(context);

    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([
      'Hello!',
      '! World',
      ' World?',
      '?',
    ]);
  });

  test('should handle empty string input', async () => {
    splitter.maxSize = 2;
    splitter.overlap = 1;

    const context = new Context({
      pageContent: '',
    });

    const newContexts = await splitter.invoke(context);

    expect(newContexts.map((c) => c.pageContent)).toStrictEqual([]);
  });
});
