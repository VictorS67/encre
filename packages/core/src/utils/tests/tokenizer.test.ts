import { expect, jest, test } from '@jest/globals';
import {
  Tiktoken,
  TiktokenEncoding,
  TiktokenModel,
  getEncodingNameForModel,
} from 'js-tiktoken';
import {
  encodingForModel,
  getEncoding,
  getNumTokens,
  getTiktokenModel,
} from '../tokenizer';

test('test getTiktokenModel', () => {
  const modelName = 'gpt-3.5-turbo-16k-0613';
  const expectModel: TiktokenModel = 'gpt-3.5-turbo-16k';
  expect(getTiktokenModel(modelName)).toBe(expectModel);

  const modelName2 = 'gpt-3.5-turbo-0613';
  const expectModel2: TiktokenModel = 'gpt-3.5-turbo';
  expect(getTiktokenModel(modelName2)).toBe(expectModel2);

  const modelName3 = 'gpt-4-32k-0314';
  const expectModel3: TiktokenModel = 'gpt-4-32k';
  expect(getTiktokenModel(modelName3)).toBe(expectModel3);

  const modelName4 = 'gpt-4-0314';
  const expectModel4: TiktokenModel = 'gpt-4';
  expect(getTiktokenModel(modelName4)).toBe(expectModel4);

  const modelName5 = 'gpt2';
  const expectModel5: TiktokenModel = 'gpt2';
  expect(getTiktokenModel(modelName5)).toBe(expectModel5);
});

test('test encodingForModel', async () => {
  const model: TiktokenModel = 'gpt-3.5-turbo-16k';
  const prompt = 'this is a prompt';

  const tiktoken: Tiktoken = await encodingForModel(model);
  const tokens: number[] = tiktoken.encode(prompt);

  expect(tiktoken.decode(tokens)).toBe(prompt);
  expect(tiktoken.encode(prompt)).toStrictEqual(tokens);
});

test('test getEncoding', async () => {
  const model: TiktokenModel = 'gpt-3.5-turbo-16k';
  const prompt = 'this is a prompt';

  const encoding: TiktokenEncoding = getEncodingNameForModel(model);
  const expectEncoding: TiktokenEncoding = 'cl100k_base';
  expect(encoding).toBe(expectEncoding);

  const tiktoken: Tiktoken = await getEncoding(encoding);
  const newTiktoken: Tiktoken = await encodingForModel(model);

  const tokens: number[] = tiktoken.encode(prompt);

  expect(newTiktoken.decode(tokens)).toBe(prompt);
  expect(newTiktoken.encode(prompt)).toStrictEqual(tokens);
});

test('test getNumTokens', async () => {
  const model = 'gpt-3.5-turbo-16k';
  const prompt = 'this is a prompt';
  // const prompt = "This is a longer text that needs to be split into chunks. It has multiple lines to demonstrate chunking. It is longer to test the multi_lines mode.";

  expect(await getNumTokens(prompt, model)).toBe(4);

  const modelNonExist = 'gpt-399';
  jest.spyOn(global.console, 'warn');
  expect(await getNumTokens(prompt, modelNonExist)).toBe(4);
  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenLastCalledWith(
    'Failed to calculate correct number of tokens, now we use 1 token ~= 4 chars in English for approximate token calculation: Error: Unknown model'
  );
});

const VALID_CHUNK_MODES = ["one_line", "multi_lines"];

export async function splitTextToChunks(
  text: string,
  maxTokens: number = 4000,
  chunkMode: string = "multi_lines",
  mustBreakAtEmptyLine: boolean = true,
  overlap: number = 10,
  model: string
): Promise<string[]> {
  if (!['multi_lines', 'one_line'].includes(chunkMode)) {
    throw new Error('Invalid chunkMode');
  }

  if (chunkMode === "one_line") {
    mustBreakAtEmptyLine = false;
  }

  const chunks: string[] = [];
  let lines: string[] = text.split("\n");
  // console.log(`length of lines: ${lines.length}`);
  let linesTokens: number[] = await Promise.all(lines.map(line => getNumTokens(line, model)));
  // console.log(`linesTokens is: ${linesTokens}`);
  let sumTokens: number = linesTokens.reduce((acc, tokenCount) => acc + tokenCount, 0);
  // console.log(`sumTokens is: ${sumTokens}`);
  while (sumTokens > maxTokens) {
    let estimatedLineCut: number = chunkMode === "one_line" ? 2 : Math.ceil((maxTokens / sumTokens) * lines.length) + 1;

    let cnt: number;
    let prev: string = "";

    for (cnt = Math.min(estimatedLineCut, lines.length) - 1; cnt >=0; cnt--) {
      // console.log(`in for loop, cnt = ${cnt}`);
      if (lines[cnt] && mustBreakAtEmptyLine && lines[cnt].trim() !== "") {
        // console.log(`cnt to skip non-empty line is:${cnt}, the line is : ${lines[cnt]}`);
        continue;
      }

      if (linesTokens.slice(0, cnt).reduce((acc, tokenCount) => acc + tokenCount, 0) <= maxTokens) {
        console.log(`find empty line`);
        prev = lines.slice(0, cnt).join("\n");
        console.log(`prev is: ${prev}`);
        break;
      }
    }
    console.log(`cnt after for loop is: ${cnt}`);
    if(cnt == -1){
      cnt = 0;
    }
    if (cnt == 0) {
      console.log("cnt is zero");
      if (linesTokens[0] > 0) {
        const splitLen: number = Math.floor((maxTokens / linesTokens[0]) * 0.9 * lines[0].length);
        console.log(`linesToken[0] = :${linesTokens[0]}, splitLen = ${splitLen}`);
        console.log(`prev before is: ${prev}`);
        prev = lines[0].slice(0, splitLen);
        console.log(`prev after is :${prev}`);
        lines[0] = lines[0].slice(splitLen);
        linesTokens[0] = await getNumTokens(lines[0], model);
      } else {
        // Handle the case where the first line's token count is zero
        prev = lines[0];
        lines = lines.slice(1);
        linesTokens = linesTokens.slice(1);
      }
    }

    if (prev.length > 0) {
      chunks.push(prev);
    }

    lines = lines.slice(cnt);
    linesTokens = linesTokens.slice(cnt);
    sumTokens = linesTokens.reduce((acc, tokenCount) => acc + tokenCount, 0);
  }

  const textToChunk: string = lines.join("\n");
  if (textToChunk.length > 0) {
    chunks.push(textToChunk);
  }

  return chunks;
}

test('should split a long text into chunks with "multi_lines" mode', async () => {
  const text = "This is a longer text that needs to be split into chunks. It has multiple lines to demonstrate chunking.\n It is longer to test the multi_lines mode.";
  // const text: string = "A ".repeat(60);
  const maxTokens = 30;
  const chunkMode = "multi_lines";
  const mustBreakAtEmptyLine = true;
  const overlap = 10;
  const model = 'gpt-3.5-turbo-16k';

  const chunks = await splitTextToChunks(text, maxTokens, chunkMode, mustBreakAtEmptyLine, overlap, model);

  // Verify that the chunks are split properly
  expect(chunks.length).toBeGreaterThanOrEqual(2); // Expecting at least 2 chunks
  
});

test('splits text at empty lines', async () => {
  const text = "First paragraph before and very long very very long very long.\n\nSecond paragraph middle.\n\nThird paragraph after.";
  const maxTokens = 10; 
  const chunkMode = "multi_lines";
  const mustBreakAtEmptyLine = true;
  const model = 'gpt-3.5-turbo-16k'; 
  const overlap = 10;
  const chunks = await splitTextToChunks(text, maxTokens, chunkMode, mustBreakAtEmptyLine, overlap, model);
  expect(chunks.length).toEqual(3); // Expecting three chunks, one for each paragraph
});

test('does not split text if maxTokens is large', async () => {
  const text = "Short text that shouldn't be split.";
  const maxTokens = 100; 
  const chunkMode = "multi_lines";
  const mustBreakAtEmptyLine = false;
  const overlap = 10;
  const model = 'gpt-3.5-turbo-16k'; 

  const chunks = await splitTextToChunks(text, maxTokens, chunkMode, mustBreakAtEmptyLine, overlap, model);
  expect(chunks.length).toEqual(1); 
});

test('handles one_line mode', async () => {
  const text = "Line one.\nLine two.\nLine three.";
  const maxTokens = 5; 
  const chunkMode = "one_line";
  const mustBreakAtEmptyLine = false;
  const overlap = 10;
  const model = 'gpt-3.5-turbo-16k';  
  
  const chunks = await splitTextToChunks(text, maxTokens, chunkMode, mustBreakAtEmptyLine, overlap, model);
  // console.log(`chunks are: ${chunks}`);
  // console.log(`chunk length is: ${chunks.length}`);
  expect(chunks.every(chunk => chunk.split("\n").length <= 1)).toBeTruthy(); // Each chunk should be a single line
});
test('handles large text with adequate maxTokens', async () => {
  const text = "A long paragraph of text that should ideally be contained within a single chunk due to sufficient maxTokens.";
  const maxTokens = 1000; // Set high to avoid splitting
  const chunkMode = "multi_lines";
  const mustBreakAtEmptyLine = false;
  const overlap = 10;
  const model = 'gpt-3.5-turbo-16k';

  const chunks = await splitTextToChunks(text, maxTokens, chunkMode, mustBreakAtEmptyLine, overlap, model);
  expect(chunks.length).toEqual(1); 
});

