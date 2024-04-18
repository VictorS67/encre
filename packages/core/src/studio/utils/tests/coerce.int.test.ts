import { expect, jest, test } from '@jest/globals';
import { Context } from '../../../events/input/load/docs/context.js';
import {
    BaseMessageLike,
    BaseMessage,
    ChatMessage,
    HumanMessage,
    BotMessage,
    SystemMessage,
    FunctionMessage,
    convertMessageLikeToMessage,
  } from '../../../events/input/load/msgs/base.js';
  import {
    StringData,
    NumberData,
    BooleanData,
    UnknownData,
    JSONObjectData,
    BlobData,
    ContextData,
    ChatMessageData,
    ArrayData,
  } from '../../data.js';
import {
    coerceToData,
    coerceTypeOptional,
    expectTypeOptional,
} from '../coerce.js'; 

test('coerceToData', () => {
    // undefined
    var a;
    expect(coerceToData(a)).toStrictEqual({ type: 'unknown', value: undefined });
    expect(coerceToData(undefined)).toStrictEqual({ type: 'unknown', value: undefined });

    // null
    expect(coerceToData(null)).toStrictEqual({ type: 'unknown', value: null });

    // string
    expect(coerceToData('test')).toStrictEqual({ type: 'string', value: 'test' });

    // boolean
    expect(coerceToData(true)).toStrictEqual({ type: 'boolean', value: true });
    expect(coerceToData(false)).toStrictEqual({ type: 'boolean', value: false });

    // number
    expect(coerceToData(5.3)).toStrictEqual({ type: 'number', value: 5.3 });

    // blob
    const blob1 = new Blob(['Hello, world!'], { type: 'text/plain' });
    const blob2 = new Blob(['<html>…</html>'], { type: 'text/html' });
    const hello = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in binary form
    const blob3 = new Blob([hello, ' ', 'world'], { type: 'text/plain' });
    expect(coerceToData(blob1)).toStrictEqual({ type: 'blob', value: new Blob(['Hello, world!'], { type: 'text/plain' }) });
    expect(coerceToData(blob2)).toStrictEqual({ type: 'blob', value: new Blob(['<html>…</html>'], { type: 'text/html' }) });
    expect(coerceToData(blob3)).toStrictEqual(
        { type: 'blob', value: new Blob([hello, ' ', 'world'], { type: 'text/plain' }) });

    // context
    const metadata1 = {
        key1: '11',
        key2: '22',
    };
    const pageContent1 = 'This is the content of the page.';
    const context1 = new Context({
        pageContent: pageContent1,
        metadata: metadata1,
    });
    expect(coerceToData(context1)).toStrictEqual({ type: 'context', value: context1 });

    // chat-message
    // ChatMessage
    const chatMessage1 = new ChatMessage('This is a general message.', 'general');
    const chatMessage2 = new ChatMessage({
        content: 'Another general message.',
        role: 'general'
    });
    expect(coerceToData(chatMessage1)).toStrictEqual({ type: 'chat-message', value: chatMessage1 });
    expect(coerceToData(chatMessage2)).toStrictEqual({ type: 'chat-message', value: chatMessage2 });

    // HumanMessage
    const humanMessage1 = new HumanMessage('Hello, how are you?');
    const humanMessage2 = new HumanMessage({
        content: "I'm doing well, thank you!",
        name: 'Alice'
    });
    expect(coerceToData(humanMessage1)).toStrictEqual({ type: 'chat-message', value: humanMessage1 });
    expect(coerceToData(humanMessage2)).toStrictEqual({ type: 'chat-message', value: humanMessage2 });

    // BotMessage
    const botMessage1 = new BotMessage('Hello, I am a bot.');
    const botMessage2 = new BotMessage({
        content: 'How can I assist you today?',
        name: 'AssistantBot'
    });
    expect(coerceToData(botMessage1)).toStrictEqual({ type: 'chat-message', value: botMessage1 });
    expect(coerceToData(botMessage2)).toStrictEqual({ type: 'chat-message', value: botMessage2 });

    // SystemMessage
    const systemMessage1 = new SystemMessage('This is a system message.');
    const systemMessage2 = new SystemMessage({
      content: 'Another system message.',
      name: 'System'
    });
    expect(coerceToData(systemMessage1)).toStrictEqual({ type: 'chat-message', value: systemMessage1 });
    expect(coerceToData(systemMessage2)).toStrictEqual({ type: 'chat-message', value: systemMessage2 });

    // FunctionMessage
    const functionMessage1 = new FunctionMessage('This is a function message.');
    const functionMessage2 = new FunctionMessage({
        content: 'Another function message.',
        name: 'Function'
    });
    expect(coerceToData(functionMessage1)).toStrictEqual({ type: 'chat-message', value: functionMessage1 });
    expect(coerceToData(functionMessage2)).toStrictEqual({ type: 'chat-message', value: functionMessage2 });

    // object
    const object1: object = { key1: 'value' };
    const object2: object = { key2: 1, key3: true };
    const object3: object = { key33: '33', key44: 66, key55: false };
    expect(coerceToData(object1)).toStrictEqual({ type: 'object', value: object1 as Record<string, unknown> });
    expect(coerceToData(object2)).toStrictEqual({ type: 'object', value: object2 as Record<string, unknown> });
    expect(coerceToData(object3)).toStrictEqual({ type: 'object', value: object3 as Record<string, unknown> });
    
    // throw error
    expect(
        new Promise((res, rej) => {
            const typeFunc = () => { console.log('Hello!'); };
            coerceToData(typeFunc);
        })
    ).rejects.toThrow();
    
    // array
    // empty array
    const emptyArray: any[] = [];
    expect(coerceToData(emptyArray)).toStrictEqual({ type: 'unknown[]', value: emptyArray });

    // chat-message in array format
    const chatMessageArrayForm1: string[] = ['human', 'Hello!'];
    const chatMessageArrayForm2: string[] = ['assistant', 'Hello!'];
    const chatMessageArrayForm3: string[] = ['system', 'Hello!'];
    const chatMessageArrayForm4: string[] = ['function', 'Hello!'];
    const chatMessageArrayForm5: string[] = ['general', 'Hello!'];
    expect(coerceToData(chatMessageArrayForm1)).toStrictEqual({ type: 'chat-message', value: ['human', 'Hello!'] });
    expect(coerceToData(chatMessageArrayForm2)).toStrictEqual({ type: 'chat-message', value: ['assistant', 'Hello!'] });
    expect(coerceToData(chatMessageArrayForm3)).toStrictEqual({ type: 'chat-message', value: ['system', 'Hello!'] });
    expect(coerceToData(chatMessageArrayForm4)).toStrictEqual({ type: 'chat-message', value: ['function', 'Hello!'] });
    expect(coerceToData(chatMessageArrayForm5)).toStrictEqual({ type: 'chat-message', value: ['general', 'Hello!'] });

    // undefined array
    const undefinedArray1: undefined[] = [undefined];
    const undefinedArray2: undefined[] = [undefined, undefined, undefined];
    expect(coerceToData(undefinedArray1)).toStrictEqual({ type: 'unknown[]', value: [undefined] });
    expect(coerceToData(undefinedArray2)).toStrictEqual({ type: 'unknown[]', value: [undefined, undefined, undefined] });

    // null array
    const nullArray1: null[] = [null];
    const nullArray2: null[] = [null, null, null];
    expect(coerceToData(nullArray1)).toStrictEqual({ type: 'unknown[]', value: [null] });
    expect(coerceToData(nullArray2)).toStrictEqual({ type: 'unknown[]', value: [null, null, null] });

    // string array
    const stringArray1: string[] = ['Hello!'];
    const stringArray2: string[] = ['Hello!', 'Hi', 'yeah.'];
    expect(coerceToData(stringArray1)).toStrictEqual({ type: 'string[]', value: ['Hello!'] });
    expect(coerceToData(stringArray2)).toStrictEqual({ type: 'string[]', value: ['Hello!', 'Hi', 'yeah.'] });

    // boolean array
    const booleanArray1: boolean[] = [true];
    const booleanArray2: boolean[] = [false];
    const booleanArray3: boolean[] = [true, false, true];
    expect(coerceToData(booleanArray1)).toStrictEqual({ type: 'boolean[]', value: [true] });
    expect(coerceToData(booleanArray2)).toStrictEqual({ type: 'boolean[]', value: [false] });
    expect(coerceToData(booleanArray3)).toStrictEqual({ type: 'boolean[]', value: [true, false, true] });

    // number array
    const numberArray1: number[] = [1];
    const numberArray2: number[] = [3.4, -1, 999];
    expect(coerceToData(numberArray1)).toStrictEqual({ type: 'number[]', value: [1] });
    expect(coerceToData(numberArray2)).toStrictEqual({ type: 'number[]', value: [3.4, -1, 999] });

    // blob array
    const blobArray1: Blob[] = [blob1];
    const blobArray2: Blob[] = [blob2, blob1, blob3];
    expect(coerceToData(blobArray1)).toStrictEqual({ type: 'blob[]', value: [blob1] });
    expect(coerceToData(blobArray2)).toStrictEqual({ type: 'blob[]', value: [blob2, blob1, blob3] });

    // context array
    const metadata2 = {
        key1: 'qq',
        key2: 'ww',
    };
    const pageContent2 = 'This is the content of the page 2.';
    const context2 = new Context({
        pageContent: pageContent2,
        metadata: metadata2,
    });

    const metadata3 = {
        key1: '1o',
        key2: '2l',
    };
    const pageContent3 = 'This is the content of the page 3.';
    const context3 = new Context({
        pageContent: pageContent3,
        metadata: metadata3,
    });

    const contextArray1: Context[] = [context1];
    const contextArray2: Context[] = [context2, context1, context3];
    expect(coerceToData(contextArray1)).toStrictEqual({ type: 'context[]', value: [context1] });
    expect(coerceToData(contextArray2)).toStrictEqual({ type: 'context[]', value: [context2, context1, context3] });

    // chat-message array
    const chatMessageArray1: BaseMessage[] = [chatMessage1];
    const chatMessageArray2: BaseMessage[] = [humanMessage1];
    const chatMessageArray3: BaseMessage[] = [botMessage1];
    const chatMessageArray4: BaseMessage[] = [systemMessage1];
    const chatMessageArray5: BaseMessage[] = [functionMessage1];

    const chatMessageArray6: BaseMessage[] = [chatMessage2, chatMessage1, chatMessage2];
    const chatMessageArray7: BaseMessage[] = [humanMessage2, humanMessage1, humanMessage2];
    const chatMessageArray8: BaseMessage[] = [botMessage2, botMessage1, botMessage2];
    const chatMessageArray9: BaseMessage[] = [systemMessage2, systemMessage1, systemMessage2];
    const chatMessageArray10: BaseMessage[] = [functionMessage2, functionMessage1, functionMessage2];

    const chatMessageArray11: BaseMessage[] = [chatMessage1, botMessage1, functionMessage2, humanMessage1];
    const chatMessageArray12: BaseMessage[] = [functionMessage2, chatMessage1, systemMessage1];

    expect(coerceToData(chatMessageArray1)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray1 });
    expect(coerceToData(chatMessageArray2)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray2 });
    expect(coerceToData(chatMessageArray3)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray3 });
    expect(coerceToData(chatMessageArray4)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray4 });
    expect(coerceToData(chatMessageArray5)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray5 });
    expect(coerceToData(chatMessageArray6)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray6 });
    expect(coerceToData(chatMessageArray7)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray7 });
    expect(coerceToData(chatMessageArray8)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray8 });
    expect(coerceToData(chatMessageArray9)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray9 });
    expect(coerceToData(chatMessageArray10)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray10 });
    expect(coerceToData(chatMessageArray11)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray11 });
    expect(coerceToData(chatMessageArray12)).toStrictEqual({ type: 'chat-message[]', value: chatMessageArray12 });

    // object array
    const objectArray1: object[] = [object1];
    const objectArray2: object[] = [object3, object2, object1];
    expect(coerceToData(objectArray1)).toStrictEqual({ type: 'object[]', value: objectArray1 });
    expect(coerceToData(objectArray2)).toStrictEqual({ type: 'object[]', value: objectArray2 });

    // mixed array
    const mixedArray: any[] = [1, 'two', true, null, undefined, blob1, context1, chatMessage2, object1];
    expect(coerceToData(mixedArray)).toStrictEqual({ type: 'unknown[]', value: mixedArray });
});

test('coerceTypeOptional', async () => {
    // undefined input
    expect(await coerceTypeOptional(undefined, 'unknown')).toBe(undefined); 
    expect(await coerceTypeOptional(undefined, 'string')).toBe(undefined); 
    expect(await coerceTypeOptional(undefined, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(undefined, 'boolean')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'context')).toBe(undefined); 
    expect(await coerceTypeOptional(undefined, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'object')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'unknown[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'string[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'boolean[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'chat-message[]')).toBe(undefined);
    expect(await coerceTypeOptional(undefined, 'object[]')).toBe(undefined);
    
    // UnknownData
    const unknownD1: UnknownData = { type: 'unknown', value: undefined };
    const unknownD2: UnknownData = { type: 'unknown', value: null };
    expect(await coerceTypeOptional(unknownD1, 'unknown')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'unknown')).toBe(null);
    expect(await coerceTypeOptional(unknownD1, 'string')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'string')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'boolean')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'boolean')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'context')).toBe(undefined); 
    expect(await coerceTypeOptional(unknownD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'object')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'object')).toBe(undefined);

    expect(await coerceTypeOptional(unknownD1, 'unknown[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'string[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'boolean[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'chat-message[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD1, 'object[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'unknown[]')).toStrictEqual(null);
    expect(await coerceTypeOptional(unknownD2, 'string[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'boolean[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'chat-message[]')).toBe(undefined);
    expect(await coerceTypeOptional(unknownD2, 'object[]')).toBe(undefined);

    // StringData
    const stringD: StringData = { type: 'string', value: 'Hello!' }; 
    const stringDN: StringData = { type: 'string', value: '4.5' }; 
    const stringD2: StringData = { type: 'string', value: 'False' }; 
    const stringD3: StringData = { type: 'string', value: '' }; 
    expect(await coerceTypeOptional(stringD, 'unknown')).toBe('Hello!');
    expect(await coerceTypeOptional(stringD, 'string')).toBe('Hello!');
    expect(await coerceTypeOptional(stringD, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(stringDN, 'number')).toEqual(4.5);
    expect(await coerceTypeOptional(stringD, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(stringD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(stringD3, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(stringD, 'blob')).toStrictEqual(new Blob(['Hello!'], { type: 'text/plain' }));
    expect(await coerceTypeOptional(stringD, 'context')).toStrictEqual(new Context({ pageContent: 'Hello!' }));
    const coercedStringToChatMessage = await coerceTypeOptional(stringD, 'chat-message');
    const stringHumanMessage = new HumanMessage('Hello!');
    expect(coercedStringToChatMessage===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedStringToChatMessage as BaseMessage, stringHumanMessage)).toBeTruthy();
    expect(await coerceTypeOptional(stringD, 'object')).toStrictEqual('Hello!');
    
    expect(await coerceTypeOptional(stringD, 'unknown[]')).toStrictEqual(['Hello!']); 
    expect(await coerceTypeOptional(stringD, 'string[]')).toStrictEqual(['Hello!']); 
    expect(await coerceTypeOptional(stringD, 'number[]')).toBe(undefined); 
    expect(await coerceTypeOptional(stringD, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(stringD, 'blob[]')).toStrictEqual([new Blob(['Hello!'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(stringD, 'context[]')).toStrictEqual([new Context({ pageContent: 'Hello!' })]);
    const coercedStringToChatMessageArray = await coerceTypeOptional(stringD, 'chat-message[]');
    expect(coercedStringToChatMessageArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedStringToChatMessageArray as BaseMessage[], [stringHumanMessage])).toBeTruthy();
    expect(await coerceTypeOptional(stringD, 'object[]')).toStrictEqual(['Hello!']);

    // NumberData
    const numberD: NumberData = { type: 'number', value: 42 }; 
    const numberD2: NumberData = { type: 'number', value: 0 }; 
    expect(await coerceTypeOptional(numberD, 'unknown')).toBe(42);
    expect(await coerceTypeOptional(numberD, 'string')).toBe('42');
    expect(await coerceTypeOptional(numberD, 'number')).toBe(42);
    expect(await coerceTypeOptional(numberD, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(numberD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(numberD, 'blob')).toStrictEqual(new Blob(['42'], { type: 'text/plain' }));
    expect(await coerceTypeOptional(numberD, 'context')).toStrictEqual(new Context({ pageContent: '42' }));
    const coercedNumberToChatMessage = await coerceTypeOptional(numberD, 'chat-message');
    const numHumanMessage = new HumanMessage('42');
    expect(coercedNumberToChatMessage===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedNumberToChatMessage as BaseMessage, numHumanMessage)).toBeTruthy();
    expect(await coerceTypeOptional(numberD, 'object')).toStrictEqual(42);

    expect(await coerceTypeOptional(numberD, 'unknown[]')).toStrictEqual([42]); 
    expect(await coerceTypeOptional(numberD, 'string[]')).toStrictEqual(['42']); 
    expect(await coerceTypeOptional(numberD, 'number[]')).toStrictEqual([42]); 
    expect(await coerceTypeOptional(numberD, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(numberD2, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(numberD, 'blob[]')).toStrictEqual([new Blob(['42'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(numberD, 'context[]')).toStrictEqual([new Context({ pageContent: '42' })]);
    const coercedNumberToChatMessageArray = await coerceTypeOptional(numberD, 'chat-message[]');
    expect(coercedNumberToChatMessageArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedNumberToChatMessageArray as BaseMessage[], [numHumanMessage])).toBeTruthy();
    expect(await coerceTypeOptional(numberD, 'object[]')).toStrictEqual([42]); 

    // BooleanData
    const booleanDt: BooleanData = { type: 'boolean', value: true }; 
    const booleanDf: BooleanData = { type: 'boolean', value: false }; 
    expect(await coerceTypeOptional(booleanDt, 'unknown')).toBe(true);
    expect(await coerceTypeOptional(booleanDf, 'unknown')).toBe(false);
    expect(await coerceTypeOptional(booleanDt, 'string')).toBe('true');
    expect(await coerceTypeOptional(booleanDf, 'string')).toBe('false');
    expect(await coerceTypeOptional(booleanDt, 'number')).toBe(1);
    expect(await coerceTypeOptional(booleanDf, 'number')).toBe(0);
    expect(await coerceTypeOptional(booleanDt, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(booleanDf, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(booleanDt, 'blob')).toStrictEqual(new Blob(['true'], { type: 'text/plain' }));
    expect(await coerceTypeOptional(booleanDf, 'blob')).toStrictEqual(new Blob(['false'], { type: 'text/plain' }));
    expect(await coerceTypeOptional(booleanDt, 'context')).toStrictEqual(new Context({ pageContent: 'true' }));
    expect(await coerceTypeOptional(booleanDf, 'context')).toStrictEqual(new Context({ pageContent: 'false' }));
    const coercedBooleanToChatMessaget = await coerceTypeOptional(booleanDt, 'chat-message');
    const booleanHumanMessaget = new HumanMessage('true');
    expect(coercedBooleanToChatMessaget===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedBooleanToChatMessaget as BaseMessage, booleanHumanMessaget)).toBeTruthy();
    const coercedBooleanToChatMessagef = await coerceTypeOptional(booleanDf, 'chat-message');
    const booleanHumanMessagef = new HumanMessage('false');
    expect(coercedBooleanToChatMessagef===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedBooleanToChatMessagef as BaseMessage, booleanHumanMessagef)).toBeTruthy();
    expect(await coerceTypeOptional(booleanDt, 'object')).toStrictEqual(true);
    expect(await coerceTypeOptional(booleanDf, 'object')).toStrictEqual(false);

    expect(await coerceTypeOptional(booleanDt, 'unknown[]')).toStrictEqual([true]); 
    expect(await coerceTypeOptional(booleanDt, 'string[]')).toStrictEqual(['true']); 
    expect(await coerceTypeOptional(booleanDt, 'number[]')).toStrictEqual([1]); 
    expect(await coerceTypeOptional(booleanDt, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(booleanDt, 'blob[]')).toStrictEqual([new Blob(['true'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(booleanDt, 'context[]')).toStrictEqual([new Context({ pageContent: 'true' })]);
    const coercedBooleanToChatMessagetArray = await coerceTypeOptional(booleanDt, 'chat-message[]');
    expect(coercedBooleanToChatMessagetArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBooleanToChatMessagetArray as BaseMessage[], [booleanHumanMessaget])).toBeTruthy();
    expect(await coerceTypeOptional(booleanDt, 'object[]')).toStrictEqual([true]); 

    expect(await coerceTypeOptional(booleanDf, 'unknown[]')).toStrictEqual([false]); 
    expect(await coerceTypeOptional(booleanDf, 'string[]')).toStrictEqual(['false']); 
    expect(await coerceTypeOptional(booleanDf, 'number[]')).toStrictEqual([0]); 
    expect(await coerceTypeOptional(booleanDf, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(booleanDf, 'blob[]')).toStrictEqual([new Blob(['false'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(booleanDf, 'context[]')).toStrictEqual([new Context({ pageContent: 'false' })]);
    const coercedBooleanToChatMessagefArray = await coerceTypeOptional(booleanDf, 'chat-message[]');
    expect(coercedBooleanToChatMessagefArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBooleanToChatMessagefArray as BaseMessage[], [booleanHumanMessagef])).toBeTruthy();
    expect(await coerceTypeOptional(booleanDf, 'object[]')).toStrictEqual([false]); 
    
    // BlobData
    const blob1 = new Blob(['Hello, world!'], { type: 'text/plain' });
    const blob2 = new Blob([], { type: 'text/plain' });
    const blobD: BlobData = { type: 'blob', value: blob1 }; 
    const blobD2: BlobData = { type: 'blob', value: blob2 }; 
    expect(await coerceTypeOptional(blobD, 'unknown')).toStrictEqual(blob1);
    expect(await coerceTypeOptional(blobD2, 'unknown')).toStrictEqual(blob2);
    expect(await coerceTypeOptional(blobD, 'string')).toBe('Hello, world!');
    expect(await coerceTypeOptional(blobD, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(blobD, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(blobD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(blobD, 'blob')).toStrictEqual(new Blob(['Hello, world!'], { type: 'text/plain' }));
    expect(await coerceTypeOptional(blobD, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(blobD, 'chat-message')).toBe(undefined); 
    expect(await coerceTypeOptional(blobD, 'object')).toStrictEqual(new Blob(['Hello, world!'], { type: 'text/plain' }));

    expect(await coerceTypeOptional(blobD, 'unknown[]')).toStrictEqual([blob1]); 
    expect(await coerceTypeOptional(blobD, 'string[]')).toStrictEqual(['Hello, world!']); 
    expect(await coerceTypeOptional(blobD, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(blobD, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(blobD, 'blob[]')).toStrictEqual([new Blob(['Hello, world!'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(blobD, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(blobD, 'chat-message[]')).toBe(undefined);
    expect(await coerceTypeOptional(blobD, 'object[]')).toStrictEqual([blob1]); 

    // ContextData
    const metadata1 = {
        key1: '11',
        key2: '22',
    };
    const pageContent1 = 'This is the content of the page.';
    const context1 = new Context({
        pageContent: pageContent1,
        metadata: metadata1,
    });

    const metadata2 = {
        key1: 'ge',
        key2: 'aa',
    };
    const pageContent2 = '';
    const context2 = new Context({
        pageContent: pageContent2,
        metadata: metadata2,
    });

    const metadata3 = {
        key1: 'ge',
        key2: 'aa',
    };
    const pageContent3 = 'false';
    const context3 = new Context({
        pageContent: pageContent3,
        metadata: metadata3,
    });

    const metadata4 = {
        key1: 'ge',
        key2: 'aa',
    };
    const pageContent4 = 'False';
    const context4 = new Context({
        pageContent: pageContent4,
        metadata: metadata4,
    });
    const contextD: ContextData = { type: 'context', value: context1 }; 
    const contextD2: ContextData = { type: 'context', value: context2 }; 
    const contextD3: ContextData = { type: 'context', value: context3 }; 
    const contextD4: ContextData = { type: 'context', value: context4 }; 
    expect(await coerceTypeOptional(contextD, 'string')).toBe('This is the content of the page.');
    expect(await coerceTypeOptional(contextD, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(contextD, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(contextD2, 'boolean')).toBe(false); 
    expect(await coerceTypeOptional(contextD3, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(contextD4, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(contextD, 'blob')).toStrictEqual(new Blob(['This is the content of the page.'], { type: 'text/plain' }));
    expect(await coerceTypeOptional(contextD, 'context')).toStrictEqual(context1);
    const coercedContextToChatMessage = await coerceTypeOptional(contextD, 'chat-message');
    const contextHumanMessage = new HumanMessage('This is the content of the page.');
    expect(coercedContextToChatMessage===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedContextToChatMessage as BaseMessage, contextHumanMessage)).toBeTruthy();
    expect(await coerceTypeOptional(contextD, 'object')).toStrictEqual(context1);

    expect(await coerceTypeOptional(contextD, 'unknown[]')).toStrictEqual([context1]); 
    expect(await coerceTypeOptional(contextD, 'string[]')).toStrictEqual(['This is the content of the page.']); 
    expect(await coerceTypeOptional(contextD, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(contextD, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(contextD2, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(contextD3, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(contextD4, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(contextD, 'blob[]')).toStrictEqual([new Blob(['This is the content of the page.'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(contextD, 'context[]')).toStrictEqual([context1]);
    const coercedContextToChatMessageArray = await coerceTypeOptional(contextD, 'chat-message[]');
    expect(coercedContextToChatMessageArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedContextToChatMessageArray as BaseMessage[], [contextHumanMessage])).toBeTruthy();
    expect(await coerceTypeOptional(contextD, 'object[]')).toStrictEqual([context1]); 

    // ChatMessageData
    // ChatMessage
    const chatMessage1 = new ChatMessage('This is a general message.', 'general');
    const chatMessage2 = new ChatMessage({
        content: 'Another general message.',
        role: 'general'
    });
    const chatMessage3 = new ChatMessage('', 'general');
    const chatMessage4: BaseMessageLike = ['general', 'Hello!'];
    const chatMessageD1: ChatMessageData = { type: 'chat-message', value: chatMessage1 }; 
    const chatMessageD2: ChatMessageData = { type: 'chat-message', value: chatMessage2 }; 
    const chatMessageD3: ChatMessageData = { type: 'chat-message', value: chatMessage3 }; 
    const chatMessageD4: ChatMessageData = { type: 'chat-message', value: chatMessage4 };

    expect(await coerceTypeOptional(chatMessageD1, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage1).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(chatMessageD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD1, 'context')).toBe(undefined);
    const coercedChatMessageToChatMessage1 = await coerceTypeOptional(chatMessageD1, 'chat-message');
    expect(coercedChatMessageToChatMessage1===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedChatMessageToChatMessage1 as BaseMessage, chatMessage1)).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD1, 'object')).toStrictEqual(chatMessage1);

    expect(await coerceTypeOptional(chatMessageD1, 'unknown[]')).toStrictEqual([chatMessage1]);
    expect(await coerceTypeOptional(chatMessageD1, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage1).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(chatMessageD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageD1, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD1, 'context[]')).toBe(undefined);
    const coercedChatMessageToChatMessage1Array = await coerceTypeOptional(chatMessageD1, 'chat-message[]');
    expect(coercedChatMessageToChatMessage1Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedChatMessageToChatMessage1Array as BaseMessage[], [chatMessage1])).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD1, 'object[]')).toStrictEqual([chatMessage1]); 

    expect(await coerceTypeOptional(chatMessageD2, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage2).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD2, 'context')).toBe(undefined);
    const coercedChatMessageToChatMessage2 = await coerceTypeOptional(chatMessageD2, 'chat-message');
    expect(coercedChatMessageToChatMessage2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedChatMessageToChatMessage2 as BaseMessage, chatMessage2)).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD2, 'object')).toStrictEqual(chatMessage2);

    expect(await coerceTypeOptional(chatMessageD2, 'unknown[]')).toStrictEqual([chatMessage2]);
    expect(await coerceTypeOptional(chatMessageD2, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage2).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(chatMessageD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD2, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageD2, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD2, 'context[]')).toBe(undefined);
    const coercedChatMessageToChatMessage2Array = await coerceTypeOptional(chatMessageD2, 'chat-message[]');
    expect(coercedChatMessageToChatMessage2Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedChatMessageToChatMessage2Array as BaseMessage[], [chatMessage2])).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD2, 'object[]')).toStrictEqual([chatMessage2]); 

    expect(await coerceTypeOptional(chatMessageD3, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD3, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageD3, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageD3, 'context')).toBe(undefined);
    const coercedChatMessageToChatMessage3 = await coerceTypeOptional(chatMessageD3, 'chat-message');
    expect(coercedChatMessageToChatMessage3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedChatMessageToChatMessage3 as BaseMessage, chatMessage3)).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD3, 'object')).toStrictEqual(chatMessage3);

    expect(await coerceTypeOptional(chatMessageD3, 'unknown[]')).toStrictEqual([chatMessage3]);
    expect(await coerceTypeOptional(chatMessageD3, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage3).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(chatMessageD3, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD3, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(chatMessageD3, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD3, 'context[]')).toBe(undefined);
    const coercedChatMessageToChatMessage3Array = await coerceTypeOptional(chatMessageD3, 'chat-message[]');
    expect(coercedChatMessageToChatMessage3Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedChatMessageToChatMessage3Array as BaseMessage[], [chatMessage3])).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD3, 'object[]')).toStrictEqual([chatMessage3]); 

    expect(await coerceTypeOptional(chatMessageD4, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage4).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageD4, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD4, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(chatMessageD4, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageD4, 'context')).toBe(undefined);
    const coercedChatMessageToChatMessage4 = await coerceTypeOptional(chatMessageD4, 'chat-message');
    const convertedChatMessage = convertMessageLikeToMessage(chatMessage4);
    expect(coercedChatMessageToChatMessage4===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedChatMessageToChatMessage4 as BaseMessage, convertedChatMessage)).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD4, 'object')).toStrictEqual(chatMessage4);

    expect(await coerceTypeOptional(chatMessageD4, 'unknown[]')).toStrictEqual([chatMessage4]);
    expect(await coerceTypeOptional(chatMessageD4, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage4).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(chatMessageD4, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD4, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageD4, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageD4, 'context[]')).toBe(undefined);
    const coercedChatMessageToChatMessage4Array = await coerceTypeOptional(chatMessageD4, 'chat-message[]');
    expect(coercedChatMessageToChatMessage4Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedChatMessageToChatMessage4Array as BaseMessage[], [convertedChatMessage])).toBeTruthy();
    expect(await coerceTypeOptional(chatMessageD4, 'object[]')).toStrictEqual([chatMessage4]); 

    // HumanMessage
    const humanMessage1 = new HumanMessage('Hello, how are you?');
    const humanMessage2 = new HumanMessage({
        content: "I'm doing well, thank you!",
        name: 'Alice'
    });
    const humanMessage3 = new HumanMessage('');
    const humanMessage4: BaseMessageLike = ['human', 'Hello!'];
    const humanMessageD1: ChatMessageData = { type: 'chat-message', value: humanMessage1 }; 
    const humanMessageD2: ChatMessageData = { type: 'chat-message', value: humanMessage2 }; 
    const humanMessageD3: ChatMessageData = { type: 'chat-message', value: humanMessage3 }; 
    const humanMessageD4: ChatMessageData = { type: 'chat-message', value: humanMessage4 }; 

    expect(await coerceTypeOptional(humanMessageD1, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage1).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(humanMessageD1, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(humanMessageD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(humanMessageD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD1, 'context')).toBe(undefined);
    const coercedHumanMessageToChatMessage1 = await coerceTypeOptional(humanMessageD1, 'chat-message');
    expect(coercedHumanMessageToChatMessage1===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedHumanMessageToChatMessage1 as BaseMessage, humanMessage1)).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD1, 'object')).toStrictEqual(humanMessage1);

    expect(await coerceTypeOptional(humanMessageD1, 'unknown[]')).toStrictEqual([humanMessage1]);
    expect(await coerceTypeOptional(humanMessageD1, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage1).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(humanMessageD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(humanMessageD1, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD1, 'context[]')).toBe(undefined);
    const coercedHumanMessageToChatMessage1Array = await coerceTypeOptional(humanMessageD1, 'chat-message[]');
    expect(coercedHumanMessageToChatMessage1Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedHumanMessageToChatMessage1Array as BaseMessage[], [humanMessage1])).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD1, 'object[]')).toStrictEqual([humanMessage1]); 

    expect(await coerceTypeOptional(humanMessageD2, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage2).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(humanMessageD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(humanMessageD2, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(humanMessageD2, 'context')).toBe(undefined);
    const coercedHumanMessageToChatMessage2 = await coerceTypeOptional(humanMessageD2, 'chat-message');
    expect(coercedHumanMessageToChatMessage2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedHumanMessageToChatMessage2 as BaseMessage, humanMessage2)).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD2, 'object')).toStrictEqual(humanMessage2);

    expect(await coerceTypeOptional(humanMessageD2, 'unknown[]')).toStrictEqual([humanMessage2]);
    expect(await coerceTypeOptional(humanMessageD2, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage2).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(humanMessageD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD2, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(humanMessageD2, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD2, 'context[]')).toBe(undefined);
    const coercedHumanMessageToChatMessage2Array = await coerceTypeOptional(humanMessageD2, 'chat-message[]');
    expect(coercedHumanMessageToChatMessage2Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedHumanMessageToChatMessage2Array as BaseMessage[], [humanMessage2])).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD2, 'object[]')).toStrictEqual([humanMessage2]); 

    expect(await coerceTypeOptional(humanMessageD3, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage3).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(humanMessageD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD3, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(humanMessageD3, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD3, 'context')).toBe(undefined);
    const coercedHumanMessageToChatMessage3 = await coerceTypeOptional(humanMessageD3, 'chat-message');
    expect(coercedHumanMessageToChatMessage3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedHumanMessageToChatMessage3 as BaseMessage, humanMessage3)).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD3, 'object')).toStrictEqual(humanMessage3);

    expect(await coerceTypeOptional(humanMessageD3, 'unknown[]')).toStrictEqual([humanMessage3]);
    expect(await coerceTypeOptional(humanMessageD3, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage3).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(humanMessageD3, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD3, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(humanMessageD3, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD3, 'context[]')).toBe(undefined);
    const coercedHumanMessageToChatMessage3Array = await coerceTypeOptional(humanMessageD3, 'chat-message[]');
    expect(coercedHumanMessageToChatMessage3Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedHumanMessageToChatMessage3Array as BaseMessage[], [humanMessage3])).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD3, 'object[]')).toStrictEqual([humanMessage3]); 

    expect(await coerceTypeOptional(humanMessageD4, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage4).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(humanMessageD4, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD4, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(humanMessageD4, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(humanMessageD4, 'context')).toBe(undefined);
    const coercedHumanMessageToChatMessage4 = await coerceTypeOptional(humanMessageD4, 'chat-message');
    expect(coercedHumanMessageToChatMessage4===undefined).toBeFalsy();
    const convertedHumanMessage = convertMessageLikeToMessage(humanMessage4);
    expect(BaseMessage.isEqualMessage(coercedHumanMessageToChatMessage4 as BaseMessage, convertedHumanMessage)).toBeTruthy(); 
    expect(await coerceTypeOptional(humanMessageD4, 'object')).toStrictEqual(humanMessage4);

    expect(await coerceTypeOptional(humanMessageD4, 'unknown[]')).toStrictEqual([humanMessage4]);
    expect(await coerceTypeOptional(humanMessageD4, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage4).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(humanMessageD4, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD4, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(humanMessageD4, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(humanMessageD4, 'context[]')).toBe(undefined);
    const coercedHumanMessageToChatMessage4Array = await coerceTypeOptional(humanMessageD4, 'chat-message[]');
    expect(coercedHumanMessageToChatMessage4Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedHumanMessageToChatMessage4Array as BaseMessage[], [convertedHumanMessage])).toBeTruthy();
    expect(await coerceTypeOptional(humanMessageD4, 'object[]')).toStrictEqual([humanMessage4]); 

    // BotMessage
    const botMessage1 = new BotMessage('Hello, I am a bot.');
    const botMessage2 = new BotMessage({
        content: 'How can I assist you today?',
        name: 'AssistantBot'
    });
    const botMessage3 = new BotMessage('');
    const botMessage4: BaseMessageLike = ['assistant', 'Hello!'];
    const botMessageD1: ChatMessageData = { type: 'chat-message', value: botMessage1 }; 
    const botMessageD2: ChatMessageData = { type: 'chat-message', value: botMessage2 }; 
    const botMessageD3: ChatMessageData = { type: 'chat-message', value: botMessage3 }; 
    const botMessageD4: ChatMessageData = { type: 'chat-message', value: botMessage4 }; 

    expect(await coerceTypeOptional(botMessageD1, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage1).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(botMessageD1, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(botMessageD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(botMessageD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD1, 'context')).toBe(undefined);
    const coercedBotMessageToChatMessage1 = await coerceTypeOptional(botMessageD1, 'chat-message');
    expect(coercedBotMessageToChatMessage1===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedBotMessageToChatMessage1 as BaseMessage, botMessage1)).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD1, 'object')).toStrictEqual(botMessage1);

    expect(await coerceTypeOptional(botMessageD1, 'unknown[]')).toStrictEqual([botMessage1]);
    expect(await coerceTypeOptional(botMessageD1, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage1).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(botMessageD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(botMessageD1, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD1, 'context[]')).toBe(undefined);
    const coercedBotMessageToChatMessage1Array = await coerceTypeOptional(botMessageD1, 'chat-message[]');
    expect(coercedBotMessageToChatMessage1Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBotMessageToChatMessage1Array as BaseMessage[], [botMessage1])).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD1, 'object[]')).toStrictEqual([botMessage1]); 

    expect(await coerceTypeOptional(botMessageD2, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage2).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(botMessageD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD2, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(botMessageD2, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(botMessageD2, 'context')).toBe(undefined);
    const coercedBotMessageToChatMessage2 = await coerceTypeOptional(botMessageD2, 'chat-message');
    expect(coercedBotMessageToChatMessage2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedBotMessageToChatMessage2 as BaseMessage, botMessage2)).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD2, 'object')).toStrictEqual(botMessage2);

    expect(await coerceTypeOptional(botMessageD2, 'unknown[]')).toStrictEqual([botMessage2]);
    expect(await coerceTypeOptional(botMessageD2, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage2).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(botMessageD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD2, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(botMessageD2, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD2, 'context[]')).toBe(undefined);
    const coercedBotMessageToChatMessage2Array = await coerceTypeOptional(botMessageD2, 'chat-message[]');
    expect(coercedBotMessageToChatMessage2Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBotMessageToChatMessage2Array as BaseMessage[], [botMessage2])).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD2, 'object[]')).toStrictEqual([botMessage2]); 

    expect(await coerceTypeOptional(botMessageD3, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage3).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(botMessageD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD3, 'boolean')).toBe(false); 
    expect(await coerceTypeOptional(botMessageD3, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(botMessageD3, 'context')).toBe(undefined);
    const coercedBotMessageToChatMessage3 = await coerceTypeOptional(botMessageD3, 'chat-message');
    expect(coercedBotMessageToChatMessage3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedBotMessageToChatMessage3 as BaseMessage, botMessage3)).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD3, 'object')).toStrictEqual(botMessage3);

    expect(await coerceTypeOptional(botMessageD3, 'unknown[]')).toStrictEqual([botMessage3]);
    expect(await coerceTypeOptional(botMessageD3, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage3).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(botMessageD3, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD3, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(botMessageD3, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD3, 'context[]')).toBe(undefined);
    const coercedBotMessageToChatMessage3Array = await coerceTypeOptional(botMessageD3, 'chat-message[]');
    expect(coercedBotMessageToChatMessage3Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBotMessageToChatMessage3Array as BaseMessage[], [botMessage3])).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD3, 'object[]')).toStrictEqual([botMessage3]); 

    expect(await coerceTypeOptional(botMessageD4, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage4).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(botMessageD4, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD4, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(botMessageD4, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD4, 'context')).toBe(undefined);
    const coercedBotMessageToChatMessage4 = await coerceTypeOptional(botMessageD4, 'chat-message');
    expect(coercedBotMessageToChatMessage4===undefined).toBeFalsy();
    const convertedBotMessage = convertMessageLikeToMessage(botMessage4);
    expect(BaseMessage.isEqualMessage(coercedBotMessageToChatMessage4 as BaseMessage, convertedBotMessage)).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD4, 'object')).toStrictEqual(botMessage4);

    expect(await coerceTypeOptional(botMessageD4, 'unknown[]')).toStrictEqual([botMessage4]);
    expect(await coerceTypeOptional(botMessageD4, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage4).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(botMessageD4, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD4, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(botMessageD4, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(botMessageD4, 'context[]')).toBe(undefined);
    const coercedBotMessageToChatMessage4Array = await coerceTypeOptional(botMessageD4, 'chat-message[]');
    expect(coercedBotMessageToChatMessage4Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBotMessageToChatMessage4Array as BaseMessage[], [convertedBotMessage])).toBeTruthy();
    expect(await coerceTypeOptional(botMessageD4, 'object[]')).toStrictEqual([botMessage4]); 

    // SystemMessage
    const systemMessage1 = new SystemMessage('This is a system message.');
    const systemMessage2 = new SystemMessage({
      content: 'Another system message.',
      name: 'System'
    });
    const systemMessage3 = new SystemMessage('');
    const systemMessage4: BaseMessageLike = ['system', 'Hello!'];
    const systemMessageD1: ChatMessageData = { type: 'chat-message', value: systemMessage1 }; 
    const systemMessageD2: ChatMessageData = { type: 'chat-message', value: systemMessage2 }; 
    const systemMessageD3: ChatMessageData = { type: 'chat-message', value: systemMessage3 }; 
    const systemMessageD4: ChatMessageData = { type: 'chat-message', value: systemMessage4 }; 

    expect(await coerceTypeOptional(systemMessageD1, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage1).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(systemMessageD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(systemMessageD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD1, 'context')).toBe(undefined); 
    const coercedSystemMessageToChatMessage1 = await coerceTypeOptional(systemMessageD1, 'chat-message');
    expect(coercedSystemMessageToChatMessage1===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedSystemMessageToChatMessage1 as BaseMessage, systemMessage1)).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD1, 'object')).toStrictEqual(systemMessage1);

    expect(await coerceTypeOptional(systemMessageD1, 'unknown[]')).toStrictEqual([systemMessage1]);
    expect(await coerceTypeOptional(systemMessageD1, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage1).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(systemMessageD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(systemMessageD1, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD1, 'context[]')).toBe(undefined);
    const coercedSystemMessageToChatMessage1Array = await coerceTypeOptional(systemMessageD1, 'chat-message[]');
    expect(coercedSystemMessageToChatMessage1Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedSystemMessageToChatMessage1Array as BaseMessage[], [systemMessage1])).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD1, 'object[]')).toStrictEqual([systemMessage1]); 

    expect(await coerceTypeOptional(systemMessageD2, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage2).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(systemMessageD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD2, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(systemMessageD2, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(systemMessageD2, 'context')).toBe(undefined);
    const coercedSystemMessageToChatMessage2 = await coerceTypeOptional(systemMessageD2, 'chat-message');
    expect(coercedSystemMessageToChatMessage2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedSystemMessageToChatMessage2 as BaseMessage, systemMessage2)).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD2, 'object')).toStrictEqual(systemMessage2);

    expect(await coerceTypeOptional(systemMessageD2, 'unknown[]')).toStrictEqual([systemMessage2]);
    expect(await coerceTypeOptional(systemMessageD2, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage2).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(systemMessageD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD2, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(systemMessageD2, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD2, 'context[]')).toBe(undefined);
    const coercedSystemMessageToChatMessage2Array = await coerceTypeOptional(systemMessageD2, 'chat-message[]');
    expect(coercedSystemMessageToChatMessage2Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedSystemMessageToChatMessage2Array as BaseMessage[], [systemMessage2])).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD2, 'object[]')).toStrictEqual([systemMessage2]); 

    expect(await coerceTypeOptional(systemMessageD3, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(systemMessageD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD3, 'boolean')).toBe(false); 
    expect(await coerceTypeOptional(systemMessageD3, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(systemMessageD3, 'context')).toBe(undefined);
    const coercedSystemMessageToChatMessage3 = await coerceTypeOptional(systemMessageD3, 'chat-message');
    expect(coercedSystemMessageToChatMessage3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedSystemMessageToChatMessage3 as BaseMessage, systemMessage3)).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD3, 'object')).toStrictEqual(systemMessage3);

    expect(await coerceTypeOptional(systemMessageD3, 'unknown[]')).toStrictEqual([systemMessage3]);
    expect(await coerceTypeOptional(systemMessageD3, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage3).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(systemMessageD3, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD3, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(systemMessageD3, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD3, 'context[]')).toBe(undefined);
    const coercedSystemMessageToChatMessage3Array = await coerceTypeOptional(systemMessageD3, 'chat-message[]');
    expect(coercedSystemMessageToChatMessage3Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedSystemMessageToChatMessage3Array as BaseMessage[], [systemMessage3])).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD3, 'object[]')).toStrictEqual([systemMessage3]); 

    expect(await coerceTypeOptional(systemMessageD4, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage4).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(systemMessageD4, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD4, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(systemMessageD4, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(systemMessageD4, 'context')).toBe(undefined);
    const coercedSystemMessageToChatMessage4 = await coerceTypeOptional(systemMessageD4, 'chat-message');
    expect(coercedSystemMessageToChatMessage4===undefined).toBeFalsy();
    const convertedSystemMessage = convertMessageLikeToMessage(systemMessage4);
    expect(BaseMessage.isEqualMessage(coercedSystemMessageToChatMessage4 as BaseMessage, convertedSystemMessage)).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD4, 'object')).toStrictEqual(systemMessage4);

    expect(await coerceTypeOptional(systemMessageD4, 'unknown[]')).toStrictEqual([systemMessage4]);
    expect(await coerceTypeOptional(systemMessageD4, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage4).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(systemMessageD4, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD4, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(systemMessageD4, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(systemMessageD4, 'context[]')).toBe(undefined);
    const coercedSystemMessageToChatMessage4Array = await coerceTypeOptional(systemMessageD4, 'chat-message[]');
    expect(coercedSystemMessageToChatMessage4Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedSystemMessageToChatMessage4Array as BaseMessage[], [convertedSystemMessage])).toBeTruthy();
    expect(await coerceTypeOptional(systemMessageD4, 'object[]')).toStrictEqual([systemMessage4]); 

    // FunctionMessage
    const functionMessage1 = new FunctionMessage('This is a function message.');
    const functionMessage2 = new FunctionMessage({
        content: 'Another function message.',
        name: 'Function'
    });
    const functionMessage3 = new FunctionMessage('');
    const functionMessage4: BaseMessageLike = ['function', 'Hello!'];
    const functionMessageD1: ChatMessageData = { type: 'chat-message', value: functionMessage1 }; 
    const functionMessageD2: ChatMessageData = { type: 'chat-message', value: functionMessage2 }; 
    const functionMessageD3: ChatMessageData = { type: 'chat-message', value: functionMessage3 }; 
    const functionMessageD4: ChatMessageData = { type: 'chat-message', value: functionMessage4 }; // this case actually cannot exists

    expect(await coerceTypeOptional(functionMessageD1, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(functionMessage1).toSerialized(),
        null,
        2
    )); 
    expect(await coerceTypeOptional(functionMessageD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD1, 'boolean')).toBe(undefined); 
    expect(await coerceTypeOptional(functionMessageD1, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(functionMessageD1, 'context')).toBe(undefined);
    const coercedFunctionMessageToChatMessage1 = await coerceTypeOptional(functionMessageD1, 'chat-message');
    expect(coercedFunctionMessageToChatMessage1===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedFunctionMessageToChatMessage1 as BaseMessage, functionMessage1)).toBeTruthy();
    expect(await coerceTypeOptional(functionMessageD1, 'object')).toStrictEqual(functionMessage1);

    expect(await coerceTypeOptional(functionMessageD1, 'unknown[]')).toStrictEqual([functionMessage1]);
    expect(await coerceTypeOptional(functionMessageD1, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(functionMessage1).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(functionMessageD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD1, 'boolean[]')).toStrictEqual(undefined);
    expect(await coerceTypeOptional(functionMessageD1, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD1, 'context[]')).toBe(undefined);
    const coercedFunctionMessageToChatMessage1Array = await coerceTypeOptional(functionMessageD1, 'chat-message[]');
    expect(coercedFunctionMessageToChatMessage1Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedFunctionMessageToChatMessage1Array as BaseMessage[], [functionMessage1])).toBeTruthy();
    expect(await coerceTypeOptional(functionMessageD1, 'object[]')).toStrictEqual([functionMessage1]); 

    expect(await coerceTypeOptional(functionMessageD2, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(functionMessage2).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(functionMessageD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD2, 'boolean')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD2, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(functionMessageD2, 'context')).toBe(undefined);
    const coercedFunctionMessageToChatMessage2 = await coerceTypeOptional(functionMessageD2, 'chat-message');
    expect(coercedFunctionMessageToChatMessage2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedFunctionMessageToChatMessage2 as BaseMessage, functionMessage2)).toBeTruthy();
    expect(await coerceTypeOptional(functionMessageD2, 'object')).toStrictEqual(functionMessage2);

    expect(await coerceTypeOptional(functionMessageD2, 'unknown[]')).toStrictEqual([functionMessage2]);
    expect(await coerceTypeOptional(functionMessageD2, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(functionMessage2).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(functionMessageD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD2, 'boolean[]')).toStrictEqual(undefined);
    expect(await coerceTypeOptional(functionMessageD2, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD2, 'context[]')).toBe(undefined);
    const coercedFunctionMessageToChatMessage2Array = await coerceTypeOptional(functionMessageD2, 'chat-message[]');
    expect(coercedFunctionMessageToChatMessage2Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedFunctionMessageToChatMessage2Array as BaseMessage[], [functionMessage2])).toBeTruthy();
    expect(await coerceTypeOptional(functionMessageD2, 'object[]')).toStrictEqual([functionMessage2]); 

    expect(await coerceTypeOptional(functionMessageD3, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(functionMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(functionMessageD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD3, 'boolean')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD3, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD3, 'context')).toBe(undefined);
    const coercedFunctionMessageToChatMessage3 = await coerceTypeOptional(functionMessageD3, 'chat-message');
    expect(coercedFunctionMessageToChatMessage3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessage(coercedFunctionMessageToChatMessage3 as BaseMessage, functionMessage3)).toBeTruthy();
    expect(await coerceTypeOptional(functionMessageD3, 'object')).toStrictEqual(functionMessage3);

    expect(await coerceTypeOptional(functionMessageD3, 'unknown[]')).toStrictEqual([functionMessage3]);
    expect(await coerceTypeOptional(functionMessageD3, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(functionMessage3).toSerialized(),
        null,
        2
    )]); 
    expect(await coerceTypeOptional(functionMessageD3, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD3, 'boolean[]')).toStrictEqual(undefined);
    expect(await coerceTypeOptional(functionMessageD3, 'blob[]')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD3, 'context[]')).toBe(undefined);
    const coercedFunctionMessageToChatMessage3Array = await coerceTypeOptional(functionMessageD3, 'chat-message[]');
    expect(coercedFunctionMessageToChatMessage3Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedFunctionMessageToChatMessage3Array as BaseMessage[], [functionMessage3])).toBeTruthy();
    expect(await coerceTypeOptional(functionMessageD3, 'object[]')).toStrictEqual([functionMessage3]); 

    // convertMessageLikeToMessage do not have case for ['function', 'Hello!'] CORRECT!
    expect(await coerceTypeOptional(functionMessageD4, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD4, 'boolean')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD4, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(functionMessageD4, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(functionMessageD4, 'object')).toStrictEqual(functionMessage4);

    // JSONObjectData
    const object1: object = { key1: 'value' };
    const object2: object = { key2: 1, key3: true };
    const object3: object = { };
    const objectD1: JSONObjectData = { type: 'object', value: object1 }; 
    const objectD2: JSONObjectData = { type: 'object', value: object2 }; 
    const objectD3: JSONObjectData = { type: 'object', value: object3 }; 
    expect(await coerceTypeOptional(objectD1, 'string')).toBe(JSON.stringify(object1, null, 2));
    expect(await coerceTypeOptional(objectD2, 'string')).toBe(JSON.stringify(object2, null, 2));
    expect(await coerceTypeOptional(objectD3, 'string')).toBe(JSON.stringify(object3, null, 2));
    expect(await coerceTypeOptional(objectD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(objectD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(objectD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(objectD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(objectD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(objectD3, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(objectD1, 'blob')).toStrictEqual(new Blob([JSON.stringify(object1, null, 2)], { type: 'text/plain' }));
    expect(await coerceTypeOptional(objectD2, 'blob')).toStrictEqual(new Blob([JSON.stringify(object2, null, 2)], { type: 'text/plain' }));
    expect(await coerceTypeOptional(objectD3, 'blob')).toStrictEqual(new Blob([JSON.stringify(object3, null, 2)], { type: 'text/plain' }));

    expect(await coerceTypeOptional(objectD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(objectD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(objectD3, 'context')).toBe(undefined);
    const object4: object = { pageContent: 'Hello!' };
    const object5: object = { pageContent: 'Hello!', metadata: { key1: 'Meta' } };
    const objectD4: JSONObjectData = { type: 'object', value: object4 }; 
    const objectD5: JSONObjectData = { type: 'object', value: object5 }; 
    expect(await coerceTypeOptional(objectD4, 'context')).toStrictEqual(new Context({ pageContent: 'Hello!' }));
    expect(await coerceTypeOptional(objectD5, 'context')).toStrictEqual(new Context({ pageContent: 'Hello!', metadata: { key1: 'Meta' } }));

    expect(await coerceTypeOptional(objectD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(objectD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(objectD3, 'chat-message')).toBe(undefined);
    const object6: object = { role: 'general', json: { role: 'general', content: 'general message' } };
    const objectD6: JSONObjectData = { type: 'object', value: object6 };
    const coercedObjectToChatMessage6 = await coerceTypeOptional(objectD6, 'chat-message');
    const objectChatMessage = new ChatMessage('general message', 'general');
    expect(BaseMessage.isEqualMessage(coercedObjectToChatMessage6 as BaseMessage, objectChatMessage)).toBeTruthy();
    const object7: object = { role: 'human', json: { content: 'human message' } };
    const objectD7: JSONObjectData = { type: 'object', value: object7 };
    const coercedObjectToChatMessage7 = await coerceTypeOptional(objectD7, 'chat-message');
    const objectHumanMessage = new HumanMessage('human message');
    expect(BaseMessage.isEqualMessage(coercedObjectToChatMessage7 as BaseMessage, objectHumanMessage)).toBeTruthy();
    const object8: object = { role: 'assistant', json: { content: 'bot message' } };
    const objectD8: JSONObjectData = { type: 'object', value: object8 };
    const coercedObjectToChatMessage8 = await coerceTypeOptional(objectD8, 'chat-message');
    const objectBotMessage = new BotMessage('bot message');
    expect(BaseMessage.isEqualMessage(coercedObjectToChatMessage8 as BaseMessage, objectBotMessage)).toBeTruthy();
    const object9: object = { role: 'system', json: { content: 'system message' } };
    const objectD9: JSONObjectData = { type: 'object', value: object9 };
    const coercedObjectToChatMessage9 = await coerceTypeOptional(objectD9, 'chat-message');
    const objectSystemMessage = new SystemMessage('system message');
    expect(BaseMessage.isEqualMessage(coercedObjectToChatMessage9 as BaseMessage, objectSystemMessage)).toBeTruthy();
    const object10: object = { role: 'function', json: { content: 'function message' } };
    const objectD10: JSONObjectData = { type: 'object', value: object10 };
    const coercedObjectToChatMessage10 = await coerceTypeOptional(objectD10, 'chat-message');
    const objectFunctionMessage = new FunctionMessage('function message');
    expect(BaseMessage.isEqualMessage(coercedObjectToChatMessage10 as BaseMessage, objectFunctionMessage)).toBeTruthy();
    const object11: object = { role: 'human', json: { content: { key: 'value' } } }; 
    const objectD11: JSONObjectData = { type: 'object', value: object11 };
    const coercedObjectToHumanMessage11 = await coerceTypeOptional(objectD11, 'chat-message');
    const objectHumanOtherContentMessage = new HumanMessage( { content: { key: 'value' } } );
    expect(BaseMessage.isEqualMessage(coercedObjectToHumanMessage11 as BaseMessage, objectHumanOtherContentMessage)).toBeTruthy();
    const object12: object = { role: 'human', json: { content: ['1', '2'] } }; 
    const objectD12: JSONObjectData = { type: 'object', value: object12 };
    const coercedObjectToHumanMessage12 = await coerceTypeOptional(objectD12, 'chat-message');
    const objectHumanOtherContentMessage2 = new HumanMessage( { content: ['1', '2'] } );
    expect(BaseMessage.isEqualMessage(coercedObjectToHumanMessage12 as BaseMessage, objectHumanOtherContentMessage2)).toBeTruthy();

    expect(await coerceTypeOptional(objectD1, 'object')).toStrictEqual(object1);

    expect(await coerceTypeOptional(objectD1, 'unknown[]')).toStrictEqual([object1]);
    expect(await coerceTypeOptional(objectD2, 'unknown[]')).toStrictEqual([object2]);
    expect(await coerceTypeOptional(objectD3, 'unknown[]')).toStrictEqual([object3]);
    expect(await coerceTypeOptional(objectD1, 'string[]')).toStrictEqual([JSON.stringify(object1, null, 2)]);
    expect(await coerceTypeOptional(objectD2, 'string[]')).toStrictEqual([JSON.stringify(object2, null, 2)]);
    expect(await coerceTypeOptional(objectD3, 'string[]')).toStrictEqual([JSON.stringify(object3, null, 2)]);
    expect(await coerceTypeOptional(objectD1, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD2, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD3, 'number[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(objectD2, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(objectD3, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(objectD1, 'blob[]')).toStrictEqual([new Blob([JSON.stringify(object1, null, 2)], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(objectD2, 'blob[]')).toStrictEqual([new Blob([JSON.stringify(object2, null, 2)], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(objectD3, 'blob[]')).toStrictEqual([new Blob([JSON.stringify(object3, null, 2)], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(objectD1, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD2, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD3, 'context[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD4, 'context[]')).toStrictEqual([new Context({ pageContent: 'Hello!' })]);
    expect(await coerceTypeOptional(objectD5, 'context[]')).toStrictEqual([new Context({ pageContent: 'Hello!', metadata: { key1: 'Meta' } })]);
    expect(await coerceTypeOptional(objectD1, 'chat-message[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD2, 'chat-message[]')).toBe(undefined);
    expect(await coerceTypeOptional(objectD3, 'chat-message[]')).toBe(undefined);
    const coercedObjectToChatMessage7Array = await coerceTypeOptional(objectD7, 'chat-message[]');
    expect(coercedObjectToChatMessage7Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedObjectToChatMessage7Array as BaseMessage[], [objectHumanMessage])).toBeTruthy();
    const coercedObjectToChatMessage8Array = await coerceTypeOptional(objectD8, 'chat-message[]');
    expect(coercedObjectToChatMessage8Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedObjectToChatMessage8Array as BaseMessage[], [objectBotMessage])).toBeTruthy();
    const coercedObjectToChatMessage9Array = await coerceTypeOptional(objectD9, 'chat-message[]');
    expect(coercedObjectToChatMessage9Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedObjectToChatMessage9Array as BaseMessage[], [objectSystemMessage])).toBeTruthy();
    const coercedObjectToChatMessage10Array = await coerceTypeOptional(objectD10, 'chat-message[]');
    expect(coercedObjectToChatMessage10Array===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedObjectToChatMessage10Array as BaseMessage[], [objectFunctionMessage])).toBeTruthy();
    expect(await coerceTypeOptional(objectD1, 'object[]')).toStrictEqual([object1]);
    expect(await coerceTypeOptional(objectD2, 'object[]')).toStrictEqual([object2]);
    expect(await coerceTypeOptional(objectD3, 'object[]')).toStrictEqual([object3]);

    // ArrayData
    // empty array
    const emptyArray: any[] = [];
    const emptyArrayD: ArrayData = { type: 'unknown[]', value: emptyArray };
    expect(await coerceTypeOptional(emptyArrayD, 'unknown')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'string')).toBe(''); 
    expect(await coerceTypeOptional(emptyArrayD, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(emptyArrayD, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(emptyArrayD, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(emptyArrayD, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(emptyArrayD, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(emptyArrayD, 'object')).toStrictEqual([]); 

    expect(await coerceTypeOptional(emptyArrayD, 'unknown[]')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'string[]')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'number[]')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'boolean[]')).toStrictEqual([]);
    expect(await coerceTypeOptional(emptyArrayD, 'blob[]')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'context[]')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'chat-message[]')).toStrictEqual([]); 
    expect(await coerceTypeOptional(emptyArrayD, 'object[]')).toStrictEqual([]); 

    // undefined array
    const undefinedArray1: undefined[] = [undefined];
    const undefinedArray2: undefined[] = [undefined, undefined, undefined];
    const undefinedArrayD1: ArrayData = { type: 'unknown[]', value: undefinedArray1 };
    const undefinedArrayD2: ArrayData = { type: 'unknown[]', value: undefinedArray2 };
    expect(await coerceTypeOptional(undefinedArrayD1, 'unknown')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'string')).toBe(''); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'boolean')).toBe(false); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(undefinedArrayD1, 'chat-message')).toBe(undefined); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'object')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'unknown[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'string[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'number[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'boolean[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(undefinedArrayD1, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'context[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'chat-message[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD1, 'object[]')).toStrictEqual([undefined]); 

    expect(await coerceTypeOptional(undefinedArrayD2, 'unknown')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'string')).toBe(''); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'boolean')).toBe(false); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(undefinedArrayD2, 'chat-message')).toBe(undefined); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'object')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(undefinedArrayD2, 'unknown[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'string[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'number[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'boolean[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(undefinedArrayD2, 'blob[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'context[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'chat-message[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(undefinedArrayD2, 'object[]')).toStrictEqual([undefined, undefined, undefined]); 

    // null array
    const nullArray1: null[] = [null];
    const nullArray2: null[] = [null, null, null];
    const nullArrayD1: ArrayData = { type: 'unknown[]', value: nullArray1 };
    const nullArrayD2: ArrayData = { type: 'unknown[]', value: nullArray2 };
    expect(await coerceTypeOptional(nullArrayD1, 'unknown')).toStrictEqual([null]);
    expect(await coerceTypeOptional(nullArrayD1, 'string')).toBe('');
    expect(await coerceTypeOptional(nullArrayD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD1, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(nullArrayD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD1, 'object')).toStrictEqual([null]);
    expect(await coerceTypeOptional(nullArrayD2, 'unknown')).toStrictEqual([null, null, null]);
    expect(await coerceTypeOptional(nullArrayD2, 'string')).toBe('');
    expect(await coerceTypeOptional(nullArrayD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(nullArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(nullArrayD2, 'object')).toStrictEqual([null, null, null]);

    expect(await coerceTypeOptional(nullArrayD1, 'unknown[]')).toStrictEqual([null]);
    expect(await coerceTypeOptional(nullArrayD1, 'string[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD1, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD1, 'boolean[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD1, 'blob[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD1, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD1, 'chat-message[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD1, 'object[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'unknown[]')).toStrictEqual([null, null, null]);
    expect(await coerceTypeOptional(nullArrayD2, 'string[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'number[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'boolean[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'blob[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'context[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'chat-message[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(nullArrayD2, 'object[]')).toStrictEqual([undefined, undefined, undefined]);

    // string array
    const stringArray1: string[] = ['Hello!'];
    const stringArray2: string[] = ['Hello!', 'Hi', 'yeah.'];
    const stringArrayD1: ArrayData = { type: 'string[]', value: stringArray1 };
    const stringArrayD2: ArrayData = { type: 'string[]', value: stringArray2 };
    expect(await coerceTypeOptional(stringArrayD1, 'unknown')).toStrictEqual(['Hello!']);
    expect(await coerceTypeOptional(stringArrayD1, 'string')).toBe('Hello!');
    expect(await coerceTypeOptional(stringArrayD1, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(stringArrayD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(stringArrayD1, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(stringArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(stringArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(stringArrayD1, 'object')).toStrictEqual(['Hello!']);
    expect(await coerceTypeOptional(stringArrayD2, 'unknown')).toStrictEqual(['Hello!', 'Hi', 'yeah.']);
    expect(await coerceTypeOptional(stringArrayD2, 'string')).toBe('Hello!\nHi\nyeah.');
    expect(await coerceTypeOptional(stringArrayD2, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(stringArrayD2, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(stringArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(stringArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(stringArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(stringArrayD2, 'object')).toStrictEqual(['Hello!', 'Hi', 'yeah.']);

    expect(await coerceTypeOptional(stringArrayD1, 'unknown[]')).toStrictEqual(['Hello!']);
    expect(await coerceTypeOptional(stringArrayD1, 'string[]')).toStrictEqual(['Hello!']);
    expect(await coerceTypeOptional(stringArrayD1, 'number[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(stringArrayD1, 'boolean[]')).toStrictEqual([true]); 
    expect(await coerceTypeOptional(stringArrayD1, 'blob[]')).toStrictEqual([new Blob(['Hello!'], { type: 'text/plain' })]); 
    expect(await coerceTypeOptional(stringArrayD1, 'context[]')).toStrictEqual([new Context({ pageContent: 'Hello!' })]);
    const coercedStringArrayToChatMessageArray = await coerceTypeOptional(stringArrayD1, 'chat-message[]') as BaseMessage[];
    const stringHumanMessageArray = [new HumanMessage('Hello!')];
    expect(coercedStringArrayToChatMessageArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedStringArrayToChatMessageArray, stringHumanMessageArray)).toBeTruthy();
    expect(await coerceTypeOptional(stringArrayD1, 'object[]')).toStrictEqual(['Hello!']);
    expect(await coerceTypeOptional(stringArrayD2, 'unknown[]')).toStrictEqual(['Hello!', 'Hi', 'yeah.']);
    expect(await coerceTypeOptional(stringArrayD2, 'string[]')).toStrictEqual(['Hello!', 'Hi', 'yeah.']);
    expect(await coerceTypeOptional(stringArrayD2, 'number[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(stringArrayD2, 'boolean[]')).toStrictEqual([true, true, true]); 
    expect(await coerceTypeOptional(stringArrayD2, 'blob[]')).toStrictEqual(
        [new Blob(['Hello!'], { type: 'text/plain' }), new Blob(['Hi'], { type: 'text/plain' }), new Blob(['yeah.'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(stringArrayD2, 'context[]')).toStrictEqual(
        [new Context({ pageContent: 'Hello!' }), new Context({ pageContent: 'Hi' }), new Context({ pageContent: 'yeah.' })]);
    const coercedStringArrayToChatMessageArray2 = await coerceTypeOptional(stringArrayD2, 'chat-message[]') as BaseMessage[];
    const stringHumanMessageArray2 = [new HumanMessage('Hello!'), new HumanMessage('Hi'), new HumanMessage('yeah.')];
    expect(coercedStringArrayToChatMessageArray2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedStringArrayToChatMessageArray2, stringHumanMessageArray2)).toBeTruthy();
    expect(await coerceTypeOptional(stringArrayD2, 'object[]')).toStrictEqual(['Hello!', 'Hi', 'yeah.']);

    // boolean array
    const booleanArray1: boolean[] = [true];
    const booleanArray2: boolean[] = [false];
    const booleanArray3: boolean[] = [true, false, true];
    const booleanArrayD1: ArrayData = { type: 'boolean[]', value: booleanArray1 };
    const booleanArrayD2: ArrayData = { type: 'boolean[]', value: booleanArray2 };
    const booleanArrayD3: ArrayData = { type: 'boolean[]', value: booleanArray3 };
    expect(await coerceTypeOptional(booleanArrayD1, 'unknown')).toStrictEqual([true]);
    expect(await coerceTypeOptional(booleanArrayD2, 'unknown')).toStrictEqual([false]);
    expect(await coerceTypeOptional(booleanArrayD3, 'unknown')).toStrictEqual([true, false, true]);
    expect(await coerceTypeOptional(booleanArrayD1, 'string')).toBe('true');
    expect(await coerceTypeOptional(booleanArrayD2, 'string')).toBe('false');
    expect(await coerceTypeOptional(booleanArrayD3, 'string')).toBe('true\nfalse\ntrue');
    expect(await coerceTypeOptional(booleanArrayD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD1, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(booleanArrayD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(booleanArrayD3, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(booleanArrayD1, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(booleanArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD3, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD3, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD1, 'chat-message')).toBe(undefined); 
    expect(await coerceTypeOptional(booleanArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD3, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(booleanArrayD1, 'object')).toStrictEqual([true]);
    expect(await coerceTypeOptional(booleanArrayD2, 'object')).toStrictEqual([false]);
    expect(await coerceTypeOptional(booleanArrayD3, 'object')).toStrictEqual([true, false, true]);

    expect(await coerceTypeOptional(booleanArrayD1, 'unknown[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(booleanArrayD2, 'unknown[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(booleanArrayD3, 'unknown[]')).toStrictEqual([true, false, true]);
    expect(await coerceTypeOptional(booleanArrayD1, 'string[]')).toStrictEqual(['true']);
    expect(await coerceTypeOptional(booleanArrayD2, 'string[]')).toStrictEqual(['false']);
    expect(await coerceTypeOptional(booleanArrayD3, 'string[]')).toStrictEqual(['true', 'false', 'true']);
    expect(await coerceTypeOptional(booleanArrayD1, 'number[]')).toStrictEqual([1]); 
    expect(await coerceTypeOptional(booleanArrayD2, 'number[]')).toStrictEqual([0]);
    expect(await coerceTypeOptional(booleanArrayD3, 'number[]')).toStrictEqual([1, 0, 1]);
    expect(await coerceTypeOptional(booleanArrayD1, 'boolean[]')).toStrictEqual([true]); 
    expect(await coerceTypeOptional(booleanArrayD2, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(booleanArrayD3, 'boolean[]')).toStrictEqual([true, false, true]); 
    expect(await coerceTypeOptional(booleanArrayD1, 'blob[]')).toStrictEqual([new Blob(['true'], { type: 'text/plain' })]); 
    expect(await coerceTypeOptional(booleanArrayD2, 'blob[]')).toStrictEqual([new Blob(['false'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(booleanArrayD3, 'blob[]')).toStrictEqual(
        [new Blob(['true'], { type: 'text/plain' }), new Blob(['false'], { type: 'text/plain' }), new Blob(['true'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(booleanArrayD1, 'context[]')).toStrictEqual([new Context({ pageContent: 'true' })]);
    expect(await coerceTypeOptional(booleanArrayD2, 'context[]')).toStrictEqual([new Context({ pageContent: 'false' })]);
    expect(await coerceTypeOptional(booleanArrayD3, 'context[]')).toStrictEqual([
        new Context({ pageContent: 'true' }), new Context({ pageContent: 'false' }), new Context({ pageContent: 'true' })]);
    const coercedBooleanArrayToChatMessageArray1 = await coerceTypeOptional(booleanArrayD1, 'chat-message[]') as BaseMessage[];
    const booleanHumanMessageArray1 = [new HumanMessage('true')];
    expect(coercedBooleanArrayToChatMessageArray1===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBooleanArrayToChatMessageArray1, booleanHumanMessageArray1)).toBeTruthy();
    const coercedBooleanArrayToChatMessageArray2 = await coerceTypeOptional(booleanArrayD2, 'chat-message[]') as BaseMessage[];
    const booleanHumanMessageArray2 = [new HumanMessage('false')];
    expect(coercedBooleanArrayToChatMessageArray2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBooleanArrayToChatMessageArray2, booleanHumanMessageArray2)).toBeTruthy();
    const coercedBooleanArrayToChatMessageArray3 = await coerceTypeOptional(booleanArrayD3, 'chat-message[]') as BaseMessage[];
    const booleanHumanMessageArray3 = [new HumanMessage('true'), new HumanMessage('false'), new HumanMessage('true')];
    expect(coercedBooleanArrayToChatMessageArray3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedBooleanArrayToChatMessageArray3, booleanHumanMessageArray3)).toBeTruthy();
    expect(await coerceTypeOptional(booleanArrayD1, 'object[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(booleanArrayD2, 'object[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(booleanArrayD3, 'object[]')).toStrictEqual([true, false, true]);

    // number array
    const numberArray1: number[] = [1];
    const numberArray2: number[] = [3.4, -1, 999];
    const numberArray3: number[] = [0];
    const numberArray4: number[] = [6, 0];
    const numberArrayD1: ArrayData = { type: 'number[]', value: numberArray1 };
    const numberArrayD2: ArrayData = { type: 'number[]', value: numberArray2 };
    const numberArrayD3: ArrayData = { type: 'number[]', value: numberArray3 };
    const numberArrayD4: ArrayData = { type: 'number[]', value: numberArray4 };
    expect(await coerceTypeOptional(numberArrayD1, 'unknown')).toStrictEqual([1]);
    expect(await coerceTypeOptional(numberArrayD2, 'unknown')).toStrictEqual([3.4, -1, 999]);
    expect(await coerceTypeOptional(numberArrayD3, 'unknown')).toStrictEqual([0]);
    expect(await coerceTypeOptional(numberArrayD4, 'unknown')).toStrictEqual([6, 0]);
    expect(await coerceTypeOptional(numberArrayD1, 'string')).toBe('1');
    expect(await coerceTypeOptional(numberArrayD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD1, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(numberArrayD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(numberArrayD3, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(numberArrayD4, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(numberArrayD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD1, 'object')).toStrictEqual([1]);
    expect(await coerceTypeOptional(numberArrayD2, 'string')).toStrictEqual('3.4\n-1\n999');
    expect(await coerceTypeOptional(numberArrayD2, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(numberArrayD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(numberArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(numberArrayD2, 'object')).toStrictEqual([3.4, -1, 999]);

    expect(await coerceTypeOptional(numberArrayD1, 'unknown[]')).toStrictEqual([1]);
    expect(await coerceTypeOptional(numberArrayD2, 'unknown[]')).toStrictEqual([3.4, -1, 999]);
    expect(await coerceTypeOptional(numberArrayD3, 'unknown[]')).toStrictEqual([0]);
    expect(await coerceTypeOptional(numberArrayD4, 'unknown[]')).toStrictEqual([6, 0]);
    expect(await coerceTypeOptional(numberArrayD1, 'string[]')).toStrictEqual(['1']);
    expect(await coerceTypeOptional(numberArrayD2, 'string[]')).toStrictEqual(['3.4', '-1', '999']);
    expect(await coerceTypeOptional(numberArrayD3, 'string[]')).toStrictEqual(['0']);
    expect(await coerceTypeOptional(numberArrayD4, 'string[]')).toStrictEqual(['6', '0']);
    expect(await coerceTypeOptional(numberArrayD1, 'number[]')).toStrictEqual([1]);
    expect(await coerceTypeOptional(numberArrayD2, 'number[]')).toStrictEqual([3.4, -1, 999]);
    expect(await coerceTypeOptional(numberArrayD3, 'number[]')).toStrictEqual([0]);
    expect(await coerceTypeOptional(numberArrayD4, 'number[]')).toStrictEqual([6, 0]);
    expect(await coerceTypeOptional(numberArrayD1, 'boolean[]')).toStrictEqual([true]); 
    expect(await coerceTypeOptional(numberArrayD2, 'boolean[]')).toStrictEqual([true, true, true]); 
    expect(await coerceTypeOptional(numberArrayD3, 'boolean[]')).toStrictEqual([false]);
    expect(await coerceTypeOptional(numberArrayD4, 'boolean[]')).toStrictEqual([true, false]);
    expect(await coerceTypeOptional(numberArrayD1, 'blob[]')).toStrictEqual([new Blob(['1'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(numberArrayD2, 'blob[]')).toStrictEqual(
        [new Blob(['3.4'], { type: 'text/plain' }), new Blob(['-1'], { type: 'text/plain' }), new Blob(['999'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(numberArrayD3, 'blob[]')).toStrictEqual([new Blob(['0'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(numberArrayD4, 'blob[]')).toStrictEqual(
        [new Blob(['6'], { type: 'text/plain' }), new Blob(['0'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(numberArrayD1, 'context[]')).toStrictEqual([new Context({ pageContent: '1' })]);
    expect(await coerceTypeOptional(numberArrayD2, 'context[]')).toStrictEqual(
        [new Context({ pageContent: '3.4' }), new Context({ pageContent: '-1' }), new Context({ pageContent: '999' })]);
    expect(await coerceTypeOptional(numberArrayD3, 'context[]')).toStrictEqual([new Context({ pageContent: '0' })]);
    expect(await coerceTypeOptional(numberArrayD4, 'context[]')).toStrictEqual(
        [new Context({ pageContent: '6' }), new Context({ pageContent: '0' })]);
    const coercedNumberArrayToChatMessageArray = await coerceTypeOptional(numberArrayD1, 'chat-message[]') as BaseMessage[];
    const numHumanMessageArray = [new HumanMessage('1')];
    expect(coercedNumberArrayToChatMessageArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedNumberArrayToChatMessageArray, numHumanMessageArray)).toBeTruthy();
    const coercedNumberArrayToChatMessageArray2 = await coerceTypeOptional(numberArrayD2, 'chat-message[]') as BaseMessage[];
    const numHumanMessageArray2 = [new HumanMessage('3.4'), new HumanMessage('-1'), new HumanMessage('999')];
    expect(coercedNumberArrayToChatMessageArray2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedNumberArrayToChatMessageArray2, numHumanMessageArray2)).toBeTruthy();
    const coercedNumberArrayToChatMessageArray3 = await coerceTypeOptional(numberArrayD3, 'chat-message[]') as BaseMessage[];
    const numHumanMessageArray3 = [new HumanMessage('0')];
    expect(coercedNumberArrayToChatMessageArray3===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedNumberArrayToChatMessageArray3, numHumanMessageArray3)).toBeTruthy();
    const coercedNumberArrayToChatMessageArray4 = await coerceTypeOptional(numberArrayD4, 'chat-message[]') as BaseMessage[];
    const numHumanMessageArray4 = [new HumanMessage('6'), new HumanMessage('0')];
    expect(coercedNumberArrayToChatMessageArray4===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedNumberArrayToChatMessageArray4, numHumanMessageArray4)).toBeTruthy();
    expect(await coerceTypeOptional(numberArrayD1, 'object[]')).toStrictEqual([1]);
    expect(await coerceTypeOptional(numberArrayD2, 'object[]')).toStrictEqual([3.4, -1, 999]);
    expect(await coerceTypeOptional(numberArrayD3, 'object[]')).toStrictEqual([0]);
    expect(await coerceTypeOptional(numberArrayD4, 'object[]')).toStrictEqual([6, 0]);


    // blob array
    const blob3 = new Blob(['hello', ' ', 'world'], { type: 'text/plain' });
    const blobArray1: Blob[] = [blob1];
    const blobArray2: Blob[] = [blob2, blob1, blob3];
    const blobArrayD1: ArrayData = { type: 'blob[]', value: blobArray1 };
    const blobArrayD2: ArrayData = { type: 'blob[]', value: blobArray2 };
    expect(await coerceTypeOptional(blobArrayD1, 'unknown')).toStrictEqual([blob1]);
    expect(await coerceTypeOptional(blobArrayD1, 'string')).toBe('Hello, world!');
    expect(await coerceTypeOptional(blobArrayD1, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(blobArrayD1, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(blobArrayD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(blobArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(blobArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(blobArrayD1, 'object')).toStrictEqual([new Blob(['Hello, world!'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(blobArrayD2, 'unknown')).toStrictEqual([blob2, blob1, blob3]);
    expect(await coerceTypeOptional(blobArrayD2, 'string')).toBe('\nHello, world!\nhello world');
    expect(await coerceTypeOptional(blobArrayD2, 'number')).toBe(undefined); 
    expect(await coerceTypeOptional(blobArrayD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(blobArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(blobArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(blobArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(blobArrayD2, 'object')).toStrictEqual([blob2, blob1, blob3]);

    expect(await coerceTypeOptional(blobArrayD1, 'unknown[]')).toStrictEqual([blob1]);
    expect(await coerceTypeOptional(blobArrayD1, 'string[]')).toStrictEqual(['Hello, world!']);
    expect(await coerceTypeOptional(blobArrayD1, 'number[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(blobArrayD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(blobArrayD1, 'blob[]')).toStrictEqual([blob1]);
    expect(await coerceTypeOptional(blobArrayD1, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(blobArrayD1, 'chat-message[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(blobArrayD1, 'object[]')).toStrictEqual([new Blob(['Hello, world!'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(blobArrayD2, 'string[]')).toStrictEqual(['', 'Hello, world!', 'hello world']);
    expect(await coerceTypeOptional(blobArrayD2, 'number[]')).toStrictEqual([undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(blobArrayD2, 'boolean[]')).toStrictEqual([false, true, true]);
    expect(await coerceTypeOptional(blobArrayD2, 'blob[]')).toStrictEqual([blob2, blob1, blob3]);
    expect(await coerceTypeOptional(blobArrayD2, 'context[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(blobArrayD2, 'chat-message[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(blobArrayD2, 'object[]')).toStrictEqual([blob2, blob1, blob3]);

    // context array
    const contextArray1: Context[] = [context1];
    const contextArray2: Context[] = [context2, context1, context3];
    const contextArrayD1: ArrayData = { type: 'context[]', value: contextArray1 };
    const contextArrayD2: ArrayData = { type: 'context[]', value: contextArray2 };
    expect(await coerceTypeOptional(contextArrayD1, 'unknown')).toStrictEqual([context1]);
    expect(await coerceTypeOptional(contextArrayD1, 'string')).toBe('This is the content of the page.');
    expect(await coerceTypeOptional(contextArrayD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD1, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(contextArrayD1, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD1, 'object')).toStrictEqual([context1]);
    expect(await coerceTypeOptional(contextArrayD2, 'unknown')).toStrictEqual([context2, context1, context3]);
    expect(await coerceTypeOptional(contextArrayD2, 'string')).toBe('\nThis is the content of the page.\nfalse');
    expect(await coerceTypeOptional(contextArrayD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD2, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(contextArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(contextArrayD2, 'object')).toStrictEqual([context2, context1, context3]);

    expect(await coerceTypeOptional(contextArrayD1, 'unknown[]')).toStrictEqual([context1]);
    expect(await coerceTypeOptional(contextArrayD1, 'string[]')).toStrictEqual(['This is the content of the page.']);
    expect(await coerceTypeOptional(contextArrayD1, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(contextArrayD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(contextArrayD1, 'blob[]')).toStrictEqual([new Blob(['This is the content of the page.'], { type: 'text/plain' })]);
    expect(await coerceTypeOptional(contextArrayD1, 'context[]')).toStrictEqual([context1]);
    const coercedContextArrayToChatMessageArray = await coerceTypeOptional(contextArrayD1, 'chat-message[]') as BaseMessage[];
    const contextHumanMessageArray = [new HumanMessage('This is the content of the page.')];
    expect(coercedContextArrayToChatMessageArray===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedContextArrayToChatMessageArray, contextHumanMessageArray)).toBeTruthy();
    expect(await coerceTypeOptional(contextArrayD1, 'object[]')).toStrictEqual([context1]);
    expect(await coerceTypeOptional(contextArrayD2, 'unknown[]')).toStrictEqual([context2, context1, context3]);
    expect(await coerceTypeOptional(contextArrayD2, 'string[]')).toStrictEqual(['', 'This is the content of the page.', 'false']);
    expect(await coerceTypeOptional(contextArrayD2, 'number[]')).toStrictEqual([undefined, undefined, undefined]);
    expect(await coerceTypeOptional(contextArrayD2, 'boolean[]')).toStrictEqual([false, true, false]);
    expect(await coerceTypeOptional(contextArrayD2, 'blob[]')).toStrictEqual(
        [new Blob([''], { type: 'text/plain' }), new Blob(['This is the content of the page.'], { type: 'text/plain' }), new Blob(['false'], { type: 'text/plain' })]
    );
    expect(await coerceTypeOptional(contextArrayD2, 'context[]')).toStrictEqual([context2, context1, context3]);
    const coercedContextArrayToChatMessageArray2 = await coerceTypeOptional(contextArrayD2, 'chat-message[]') as BaseMessage[];
    const contextHumanMessageArray2 = [new HumanMessage(''), new HumanMessage('This is the content of the page.'), new HumanMessage('false')];
    expect(coercedContextArrayToChatMessageArray2===undefined).toBeFalsy();
    expect(BaseMessage.isEqualMessageArray(coercedContextArrayToChatMessageArray2, contextHumanMessageArray2)).toBeTruthy();
    expect(await coerceTypeOptional(contextArrayD2, 'object[]')).toStrictEqual([context2, context1, context3]);

    // chat-message array
    const chatMessageArray1: BaseMessage[] = [chatMessage1];
    const chatMessageArray2: BaseMessage[] = [humanMessage1];
    const chatMessageArray3: BaseMessage[] = [botMessage1];
    const chatMessageArray4: BaseMessage[] = [systemMessage1];
    const chatMessageArray5: BaseMessage[] = [functionMessage1];

    const chatMessageArray6: BaseMessage[] = [chatMessage1, humanMessage1, botMessage1, systemMessage1, functionMessage1];

    const chatMessageArray7: BaseMessage[] = [chatMessage3];
    const chatMessageArray8: BaseMessage[] = [humanMessage3];
    const chatMessageArray9: BaseMessage[] = [botMessage3];
    const chatMessageArray10: BaseMessage[] = [systemMessage3];
    const chatMessageArray11: BaseMessage[] = [functionMessage3];

    const chatMessageArray12: BaseMessage[] = [chatMessage3, humanMessage1, botMessage1, systemMessage1];

    const chatMessageArray13: BaseMessageLike[] = [chatMessage1, humanMessage1, botMessage1, systemMessage1];

    const chatMessageArray14: BaseMessageLike[] = [chatMessage4]; 
    const chatMessageArray15: BaseMessageLike[] = [humanMessage4];
    const chatMessageArray16: BaseMessageLike[] = [botMessage4];
    const chatMessageArray17: BaseMessageLike[] = [systemMessage4];

    const chatMessageArray18: BaseMessageLike[] = [chatMessage4, humanMessage1, botMessage3, systemMessage4];

    const chatMessageArrayD1: ArrayData = { type: 'chat-message[]', value: chatMessageArray1 };
    const chatMessageArrayD2: ArrayData = { type: 'chat-message[]', value: chatMessageArray2 };
    const chatMessageArrayD3: ArrayData = { type: 'chat-message[]', value: chatMessageArray3 };
    const chatMessageArrayD4: ArrayData = { type: 'chat-message[]', value: chatMessageArray4 };
    const chatMessageArrayD5: ArrayData = { type: 'chat-message[]', value: chatMessageArray5 };
    const chatMessageArrayD6: ArrayData = { type: 'chat-message[]', value: chatMessageArray6 };

    const chatMessageArrayD7: ArrayData = { type: 'chat-message[]', value: chatMessageArray7 };
    const chatMessageArrayD8: ArrayData = { type: 'chat-message[]', value: chatMessageArray8 };
    const chatMessageArrayD9: ArrayData = { type: 'chat-message[]', value: chatMessageArray9 };
    const chatMessageArrayD10: ArrayData = { type: 'chat-message[]', value: chatMessageArray10 };
    const chatMessageArrayD11: ArrayData = { type: 'chat-message[]', value: chatMessageArray11 };
    const chatMessageArrayD12: ArrayData = { type: 'chat-message[]', value: chatMessageArray12 };
    const chatMessageArrayD13: ArrayData = { type: 'chat-message[]', value: chatMessageArray13 };
    const chatMessageArrayD14: ArrayData = { type: 'chat-message[]', value: chatMessageArray14 };
    const chatMessageArrayD15: ArrayData = { type: 'chat-message[]', value: chatMessageArray15 };
    const chatMessageArrayD16: ArrayData = { type: 'chat-message[]', value: chatMessageArray16 };
    const chatMessageArrayD17: ArrayData = { type: 'chat-message[]', value: chatMessageArray17 };
    const chatMessageArrayD18: ArrayData = { type: 'chat-message[]', value: chatMessageArray18 };

    expect(await coerceTypeOptional(chatMessageArrayD1, 'unknown')).toStrictEqual([chatMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage1).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'object')).toStrictEqual([chatMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD1, 'unknown[]')).toStrictEqual([chatMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage1).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD1, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'chat-message[]')).toStrictEqual([chatMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD1, 'object[]')).toStrictEqual([chatMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD2, 'unknown')).toStrictEqual([humanMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage1).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'object')).toStrictEqual([humanMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD2, 'unknown[]')).toStrictEqual([humanMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage1).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD2, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'chat-message[]')).toStrictEqual([humanMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD2, 'object[]')).toStrictEqual([humanMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD3, 'unknown')).toStrictEqual([botMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage1).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD3, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD3, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'object')).toStrictEqual([botMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD3, 'unknown[]')).toStrictEqual([botMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage1).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD3, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'chat-message[]')).toStrictEqual([botMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD3, 'object[]')).toStrictEqual([botMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD4, 'unknown')).toStrictEqual([systemMessage1]);    
    expect(await coerceTypeOptional(chatMessageArrayD4, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage1).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD4, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD4, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'object')).toStrictEqual([systemMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD4, 'unknown[]')).toStrictEqual([systemMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage1).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD4, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'chat-message[]')).toStrictEqual([systemMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD4, 'object[]')).toStrictEqual([systemMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD5, 'unknown')).toStrictEqual([functionMessage1]);    
    expect(await coerceTypeOptional(chatMessageArrayD5, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(functionMessage1).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD5, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'boolean')).toBe(false); 
    expect(await coerceTypeOptional(chatMessageArrayD5, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD5, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'object')).toStrictEqual([functionMessage1]);

    expect(await coerceTypeOptional(chatMessageArrayD5, 'unknown[]')).toStrictEqual([functionMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(functionMessage1).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'boolean[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD5, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'chat-message[]')).toStrictEqual([functionMessage1]);
    expect(await coerceTypeOptional(chatMessageArrayD5, 'object[]')).toStrictEqual([functionMessage1]);


    const messageStrings6 = [
        JSON.stringify(
            convertMessageLikeToMessage(chatMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(humanMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(botMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(systemMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(functionMessage1).toSerialized(),
            null,
            2
        )
    ];
    expect(await coerceTypeOptional(chatMessageArrayD6, 'unknown')).toStrictEqual(chatMessageArray6);    
    expect(await coerceTypeOptional(chatMessageArrayD6, 'string')).toBe(messageStrings6.join('\n'));
    expect(await coerceTypeOptional(chatMessageArrayD6, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD6, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'object')).toStrictEqual(chatMessageArray6);

    expect(await coerceTypeOptional(chatMessageArrayD6, 'unknown[]')).toStrictEqual(chatMessageArray6);    
    expect(await coerceTypeOptional(chatMessageArrayD6, 'string[]')).toStrictEqual(messageStrings6);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'number[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'boolean[]')).toStrictEqual(
        [true, true, true, true, undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD6, 'blob[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD6, 'context[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'chat-message[]')).toStrictEqual(chatMessageArray6);
    expect(await coerceTypeOptional(chatMessageArrayD6, 'object[]')).toStrictEqual(chatMessageArray6);

    expect(await coerceTypeOptional(chatMessageArrayD7, 'unknown')).toStrictEqual(chatMessageArray7);    
    expect(await coerceTypeOptional(chatMessageArrayD7, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD7, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD7, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'object')).toStrictEqual([chatMessage3]);

    expect(await coerceTypeOptional(chatMessageArrayD7, 'unknown[]')).toStrictEqual(chatMessageArray7);    
    expect(await coerceTypeOptional(chatMessageArrayD7, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage3).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'boolean[]')).toStrictEqual([false]); 
    expect(await coerceTypeOptional(chatMessageArrayD7, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD7, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'chat-message[]')).toStrictEqual(chatMessageArray7);
    expect(await coerceTypeOptional(chatMessageArrayD7, 'object[]')).toStrictEqual(chatMessageArray7);

    expect(await coerceTypeOptional(chatMessageArrayD8, 'unknown')).toStrictEqual(chatMessageArray8);    
    expect(await coerceTypeOptional(chatMessageArrayD8, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD8, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD8, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'object')).toStrictEqual([humanMessage3]);

    expect(await coerceTypeOptional(chatMessageArrayD8, 'unknown[]')).toStrictEqual(chatMessageArray8);    
    expect(await coerceTypeOptional(chatMessageArrayD8, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage3).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'boolean[]')).toStrictEqual([false]); 
    expect(await coerceTypeOptional(chatMessageArrayD8, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD8, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'chat-message[]')).toStrictEqual(chatMessageArray8);
    expect(await coerceTypeOptional(chatMessageArrayD8, 'object[]')).toStrictEqual(chatMessageArray8);

    expect(await coerceTypeOptional(chatMessageArrayD9, 'unknown')).toStrictEqual(chatMessageArray9);    
    expect(await coerceTypeOptional(chatMessageArrayD9, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD9, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD9, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'object')).toStrictEqual([botMessage3]);

    expect(await coerceTypeOptional(chatMessageArrayD9, 'unknown[]')).toStrictEqual(chatMessageArray9);    
    expect(await coerceTypeOptional(chatMessageArrayD9, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage3).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'boolean[]')).toStrictEqual([false]); 
    expect(await coerceTypeOptional(chatMessageArrayD9, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD9, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'chat-message[]')).toStrictEqual(chatMessageArray9);
    expect(await coerceTypeOptional(chatMessageArrayD9, 'object[]')).toStrictEqual(chatMessageArray9);

    expect(await coerceTypeOptional(chatMessageArrayD10, 'unknown')).toStrictEqual(chatMessageArray10);    
    expect(await coerceTypeOptional(chatMessageArrayD10, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD10, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD10, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'object')).toStrictEqual([systemMessage3]);

    expect(await coerceTypeOptional(chatMessageArrayD10, 'unknown[]')).toStrictEqual(chatMessageArray10);    
    expect(await coerceTypeOptional(chatMessageArrayD10, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage3).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'boolean[]')).toStrictEqual([false]); 
    expect(await coerceTypeOptional(chatMessageArrayD10, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD10, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'chat-message[]')).toStrictEqual(chatMessageArray10);
    expect(await coerceTypeOptional(chatMessageArrayD10, 'object[]')).toStrictEqual(chatMessageArray10);

    expect(await coerceTypeOptional(chatMessageArrayD11, 'unknown')).toStrictEqual(chatMessageArray11);    
    expect(await coerceTypeOptional(chatMessageArrayD11, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(functionMessage3).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD11, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD11, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'object')).toStrictEqual([functionMessage3]);

    expect(await coerceTypeOptional(chatMessageArrayD11, 'unknown[]')).toStrictEqual(chatMessageArray11);    
    expect(await coerceTypeOptional(chatMessageArrayD11, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(functionMessage3).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'boolean[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD11, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD11, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'chat-message[]')).toStrictEqual(chatMessageArray11);
    expect(await coerceTypeOptional(chatMessageArrayD11, 'object[]')).toStrictEqual(chatMessageArray11);

    const messageStrings12 = [
        JSON.stringify(
            convertMessageLikeToMessage(chatMessage3).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(humanMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(botMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(systemMessage1).toSerialized(),
            null,
            2
        )
    ];
    expect(await coerceTypeOptional(chatMessageArrayD12, 'unknown')).toStrictEqual(chatMessageArray12);    
    expect(await coerceTypeOptional(chatMessageArrayD12, 'string')).toBe(messageStrings12.join('\n'));
    expect(await coerceTypeOptional(chatMessageArrayD12, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'boolean')).toBe(false);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD12, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'object')).toStrictEqual(chatMessageArray12);

    expect(await coerceTypeOptional(chatMessageArrayD12, 'unknown[]')).toStrictEqual(chatMessageArray12);    
    expect(await coerceTypeOptional(chatMessageArrayD12, 'string[]')).toStrictEqual(messageStrings12);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'number[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'boolean[]')).toStrictEqual(
        [false, true, true, true]); 
    expect(await coerceTypeOptional(chatMessageArrayD12, 'blob[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD12, 'context[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'chat-message[]')).toStrictEqual(chatMessageArray12);
    expect(await coerceTypeOptional(chatMessageArrayD12, 'object[]')).toStrictEqual(chatMessageArray12);

    const messageStrings13 = [
        JSON.stringify(
            convertMessageLikeToMessage(chatMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(humanMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(botMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(systemMessage1).toSerialized(),
            null,
            2
        )
    ];
    expect(await coerceTypeOptional(chatMessageArrayD13, 'unknown')).toStrictEqual(chatMessageArray13);    
    expect(await coerceTypeOptional(chatMessageArrayD13, 'string')).toBe(messageStrings13.join('\n'));
    expect(await coerceTypeOptional(chatMessageArrayD13, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD13, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'object')).toStrictEqual(chatMessageArray13);

    expect(await coerceTypeOptional(chatMessageArrayD13, 'unknown[]')).toStrictEqual(chatMessageArray13);    
    expect(await coerceTypeOptional(chatMessageArrayD13, 'string[]')).toStrictEqual(messageStrings13);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'number[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'boolean[]')).toStrictEqual(
        [true, true, true, true]); 
    expect(await coerceTypeOptional(chatMessageArrayD13, 'blob[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD13, 'context[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'chat-message[]')).toStrictEqual(chatMessageArray13);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'object[]')).toStrictEqual(chatMessageArray13);

    expect(await coerceTypeOptional(chatMessageArrayD14, 'unknown')).toStrictEqual([chatMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(chatMessage4).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD14, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD14, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'object')).toStrictEqual([chatMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD14, 'unknown[]')).toStrictEqual([chatMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(chatMessage4).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD14, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'chat-message[]')).toStrictEqual([chatMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD14, 'object[]')).toStrictEqual([chatMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD15, 'unknown')).toStrictEqual([humanMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(humanMessage4).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD15, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'object')).toStrictEqual([humanMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD15, 'unknown[]')).toStrictEqual([humanMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(humanMessage4).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD15, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'chat-message[]')).toStrictEqual([humanMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD15, 'object[]')).toStrictEqual([humanMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD16, 'unknown')).toStrictEqual([botMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(botMessage4).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD16, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD16, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'object')).toStrictEqual([botMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD16, 'unknown[]')).toStrictEqual([botMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(botMessage4).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD16, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'chat-message[]')).toStrictEqual([botMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD16, 'object[]')).toStrictEqual([botMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD17, 'unknown')).toStrictEqual([systemMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'string')).toBe(JSON.stringify(
        convertMessageLikeToMessage(systemMessage4).toSerialized(),
        null,
        2
    ));
    expect(await coerceTypeOptional(chatMessageArrayD17, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD17, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'object')).toStrictEqual([systemMessage4]);

    expect(await coerceTypeOptional(chatMessageArrayD17, 'unknown[]')).toStrictEqual([systemMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'string[]')).toStrictEqual([JSON.stringify(
        convertMessageLikeToMessage(systemMessage4).toSerialized(),
        null,
        2
    )]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'blob[]')).toStrictEqual([undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD17, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'chat-message[]')).toStrictEqual([systemMessage4]);
    expect(await coerceTypeOptional(chatMessageArrayD17, 'object[]')).toStrictEqual([systemMessage4]);

    const messageStrings18 = [
        JSON.stringify(
            convertMessageLikeToMessage(chatMessage4).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(humanMessage1).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(botMessage3).toSerialized(),
            null,
            2
        ),
        JSON.stringify(
            convertMessageLikeToMessage(systemMessage4).toSerialized(),
            null,
            2
        )
    ];
    expect(await coerceTypeOptional(chatMessageArrayD18, 'unknown')).toStrictEqual(chatMessageArray18);    
    expect(await coerceTypeOptional(chatMessageArrayD18, 'string')).toBe(messageStrings18.join('\n'));
    expect(await coerceTypeOptional(chatMessageArrayD18, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD13, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(chatMessageArrayD18, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'object')).toStrictEqual(chatMessageArray18);

    expect(await coerceTypeOptional(chatMessageArrayD18, 'unknown[]')).toStrictEqual(chatMessageArray18);    
    expect(await coerceTypeOptional(chatMessageArrayD18, 'string[]')).toStrictEqual(messageStrings18);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'number[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'boolean[]')).toStrictEqual(
        [true, true, false, true]); 
    expect(await coerceTypeOptional(chatMessageArrayD18, 'blob[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]); 
    expect(await coerceTypeOptional(chatMessageArrayD18, 'context[]')).toStrictEqual(
        [undefined, undefined, undefined, undefined]);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'chat-message[]')).toStrictEqual(chatMessageArray18);
    expect(await coerceTypeOptional(chatMessageArrayD18, 'object[]')).toStrictEqual(chatMessageArray18);

    // object array
    const objectArray1: object[] = [object2];
    const objectArray2: object[] = [object1, object2, object3, object4, object5, 
        object6, object7, object8, object9, object10, object11, object12];
    const objectArrayD1: ArrayData = { type: 'object[]', value: objectArray1 };
    const objectArrayD2: ArrayData = { type: 'object[]', value: objectArray2 };
    expect(await coerceTypeOptional(objectArrayD1, 'unknown')).toStrictEqual([object2]); 
    expect(await coerceTypeOptional(objectArrayD1, 'string')).toBe(JSON.stringify(object2, null, 2));
    expect(await coerceTypeOptional(objectArrayD1, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD1, 'boolean')).toBe(true); 
    expect(await coerceTypeOptional(objectArrayD1, 'blob')).toBe(undefined); 
    expect(await coerceTypeOptional(objectArrayD1, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD1, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD1, 'object')).toStrictEqual([object2]);

    expect(await coerceTypeOptional(objectArrayD1, 'unknown[]')).toStrictEqual([object2]);
    expect(await coerceTypeOptional(objectArrayD1, 'string[]')).toStrictEqual([JSON.stringify(object2, null, 2)]);
    expect(await coerceTypeOptional(objectArrayD1, 'number[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(objectArrayD1, 'boolean[]')).toStrictEqual([true]);
    expect(await coerceTypeOptional(objectArrayD1, 'blob[]')).toStrictEqual([new Blob([JSON.stringify(object2, null, 2)], { type: 'text/plain' })]); 
    expect(await coerceTypeOptional(objectArrayD1, 'context[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(objectArrayD1, 'chat-message[]')).toStrictEqual([undefined]);
    expect(await coerceTypeOptional(objectArrayD1, 'object[]')).toStrictEqual([object2]);

    const objectStrings = [
        JSON.stringify(object1, null, 2), JSON.stringify(object2, null, 2), JSON.stringify(object3, null, 2),
        JSON.stringify(object4, null, 2), JSON.stringify(object5, null, 2), JSON.stringify(object6, null, 2),
        JSON.stringify(object7, null, 2), JSON.stringify(object8, null, 2), JSON.stringify(object9, null, 2),
        JSON.stringify(object10, null, 2), JSON.stringify(object11, null, 2), JSON.stringify(object12, null, 2),
    ];
    expect(await coerceTypeOptional(objectArrayD2, 'unknown')).toStrictEqual(objectArray2);
    expect(await coerceTypeOptional(objectArrayD2, 'string')).toBe(objectStrings.join('\n'));
    expect(await coerceTypeOptional(objectArrayD2, 'number')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD2, 'boolean')).toBe(true);
    expect(await coerceTypeOptional(objectArrayD2, 'blob')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD2, 'context')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD2, 'chat-message')).toBe(undefined);
    expect(await coerceTypeOptional(objectArrayD2, 'object')).toStrictEqual(objectArray2);

    expect(await coerceTypeOptional(objectArrayD2, 'unknown[]')).toStrictEqual(objectArray2);
    expect(await coerceTypeOptional(objectArrayD2, 'string[]')).toStrictEqual(objectStrings);
    expect(await coerceTypeOptional(objectArrayD2, 'number[]')).toStrictEqual(
        [
            undefined, undefined, undefined, 
            undefined, undefined, undefined,
            undefined, undefined, undefined,
            undefined, undefined, undefined
        ]
    );
    expect(await coerceTypeOptional(objectArrayD2, 'boolean[]')).toStrictEqual(
        [
            true, true, true,
            true, true, true,
            true, true, true,
            true, true, true
        ]
    );
    expect(await coerceTypeOptional(objectArrayD2, 'blob[]')).toStrictEqual(
        [
            new Blob([JSON.stringify(object1, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object2, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object3, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object4, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object5, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object6, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object7, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object8, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object9, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object10, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object11, null, 2)], { type: 'text/plain' }),
            new Blob([JSON.stringify(object12, null, 2)], { type: 'text/plain' })
        ]
    ); 
    expect(await coerceTypeOptional(objectArrayD2, 'context[]')).toStrictEqual(
        [
            undefined, undefined, undefined,
            new Context({ pageContent: 'Hello!' }), new Context({ pageContent: 'Hello!', metadata: { key1: 'Meta' } }), undefined,
            undefined, undefined, undefined,
            undefined, undefined, undefined
        ]
    );
    const coercedObjectArrayToChatMessageArray = await coerceTypeOptional(objectArrayD2, 'chat-message[]') as BaseMessage[];
    expect(coercedObjectArrayToChatMessageArray===undefined).toBeFalsy();
    expect(coercedObjectArrayToChatMessageArray[0]===undefined).toBeTruthy();
    expect(coercedObjectArrayToChatMessageArray[1]===undefined).toBeTruthy();
    expect(coercedObjectArrayToChatMessageArray[2]===undefined).toBeTruthy();
    expect(coercedObjectArrayToChatMessageArray[3]===undefined).toBeTruthy();
    expect(coercedObjectArrayToChatMessageArray[4]===undefined).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[5] as BaseMessage, objectChatMessage)).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[6] as BaseMessage, objectHumanMessage)).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[7] as BaseMessage, objectBotMessage)).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[8] as BaseMessage, objectSystemMessage)).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[9] as BaseMessage, objectFunctionMessage)).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[10] as BaseMessage, objectHumanOtherContentMessage)).toBeTruthy();
    expect(BaseMessage.isEqualMessage(coercedObjectArrayToChatMessageArray[11] as BaseMessage, objectHumanOtherContentMessage2)).toBeTruthy();
    expect(await coerceTypeOptional(objectArrayD2, 'object[]')).toStrictEqual(objectArray2);

});

test('expectTypeOptional', () => {

    // unknown
    const unknown1: UnknownData = { type: 'unknown', value: undefined };
    expect(expectTypeOptional(unknown1, 'unknown')).resolves.toBe(undefined);
    expect(expectTypeOptional(unknown1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(unknown1, 'unknown[]')).resolves.toStrictEqual([undefined]);
    expect(expectTypeOptional(unknown1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown1, 'object[]')).rejects.toThrow();

    const unknown2: UnknownData = { type: 'unknown', value: null };
    expect(expectTypeOptional(unknown2, 'unknown')).resolves.toBe(null);
    expect(expectTypeOptional(unknown2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(unknown2, 'unknown[]')).resolves.toStrictEqual([null]);
    expect(expectTypeOptional(unknown2, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(unknown2, 'object[]')).rejects.toThrow();

    // string
    const string1: StringData = { type: 'string', value: 'Hello!' };
    expect(expectTypeOptional(string1, 'unknown')).resolves.toBe('Hello!');
    expect(expectTypeOptional(string1, 'string')).resolves.toBe('Hello!');
    expect(expectTypeOptional(string1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(string1, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'string[]')).resolves.toStrictEqual(['Hello!']);
    expect(expectTypeOptional(string1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(string1, 'object[]')).rejects.toThrow();

    // number
    const number1: NumberData = { type: 'number', value: 66.6 };
    expect(expectTypeOptional(number1, 'unknown')).resolves.toBe(66.6);
    expect(expectTypeOptional(number1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'number')).resolves.toBe(66.6);
    expect(expectTypeOptional(number1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(number1, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(number1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(number1, 'number[]')).resolves.toStrictEqual([66.6]);
    expect(expectTypeOptional(number1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(number1, 'object[]')).rejects.toThrow();

    // boolean
    const boolean1: BooleanData = { type: 'boolean', value: true };
    const boolean2: BooleanData = { type: 'boolean', value: false };
    expect(expectTypeOptional(boolean1, 'unknown')).resolves.toBe(true);
    expect(expectTypeOptional(boolean1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'boolean')).resolves.toBe(true);
    expect(expectTypeOptional(boolean1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(boolean1, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(boolean1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(boolean1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(boolean1, 'boolean[]')).resolves.toStrictEqual([true]);
    expect(expectTypeOptional(boolean1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(boolean1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(boolean2, 'unknown')).resolves.toBe(false);
    expect(expectTypeOptional(boolean2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'boolean')).resolves.toBe(false);
    expect(expectTypeOptional(boolean2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(boolean2, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(boolean2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(boolean2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(boolean2, 'boolean[]')).resolves.toStrictEqual([false]);
    expect(expectTypeOptional(boolean2, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(boolean2, 'object[]')).rejects.toThrow();

    // blob
    const blob1 = new Blob(['Hello, world!'], { type: 'text/plain' });
    const blobD: BlobData = { type: 'blob', value: blob1 };
    expect(expectTypeOptional(blobD, 'unknown')).resolves.toBe(blob1);
    expect(expectTypeOptional(blobD, 'string')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'number')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'blob')).resolves.toBe(blob1);
    expect(expectTypeOptional(blobD, 'context')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'object')).rejects.toThrow();

    expect(expectTypeOptional(blobD, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(blobD, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(blobD, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(blobD, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(blobD, 'blob[]')).resolves.toStrictEqual([blob1]);
    expect(expectTypeOptional(blobD, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(blobD, 'object[]')).rejects.toThrow();

    // context
    const metadata1 = {
        key1: '11',
        key2: '22',
    };
    const pageContent1 = 'This is the content of the page.';
    const context1 = new Context({
        pageContent: pageContent1,
        metadata: metadata1,
    });
    const contextD: ContextData = { type: 'context', value: context1 }; 
    expect(expectTypeOptional(contextD, 'unknown')).resolves.toBe(context1);
    expect(expectTypeOptional(contextD, 'string')).rejects.toThrow();
    expect(expectTypeOptional(contextD, 'number')).rejects.toThrow();
    expect(expectTypeOptional(contextD, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(contextD, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(contextD, 'context')).resolves.toBe(context1);
    expect(expectTypeOptional(contextD, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(contextD, 'object')).rejects.toThrow();

    expect(expectTypeOptional(contextD, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(contextD, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(contextD, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(contextD, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(contextD, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(contextD, 'context[]')).resolves.toStrictEqual([context1]);
    expect(expectTypeOptional(contextD, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(contextD, 'object[]')).rejects.toThrow();

    // chat-message
    // ChatMessage
    const chatMessage1 = new ChatMessage('This is a general message.', 'general');
    const chatMessage2 = new ChatMessage({
        content: 'Another general message.',
        role: 'general'
    });
    const chatMessage3 = new ChatMessage('', 'general');
    const chatMessage4: BaseMessageLike = ['general', 'Hello!'];
    const chatD1: ChatMessageData = { type: 'chat-message', value: chatMessage1 };
    const chatD2: ChatMessageData = { type: 'chat-message', value: chatMessage2 };
    const chatD3: ChatMessageData = { type: 'chat-message', value: chatMessage3 }; 
    const chatD4: ChatMessageData = { type: 'chat-message', value: chatMessage4 }; 
    expect(expectTypeOptional(chatD1, 'unknown')).resolves.toBe(chatMessage1);
    expect(expectTypeOptional(chatD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(chatD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(chatD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(chatD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(chatD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(chatD1, 'chat-message')).resolves.toBe(chatMessage1);
    expect(expectTypeOptional(chatD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(chatD1, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD1, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD1, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD1, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD1, 'chat-message[]')).resolves.toStrictEqual([chatMessage1]);
    expect(expectTypeOptional(chatD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(chatD2, 'unknown')).resolves.toBe(chatMessage2);
    expect(expectTypeOptional(chatD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(chatD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(chatD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(chatD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(chatD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(chatD2, 'chat-message')).resolves.toBe(chatMessage2);
    expect(expectTypeOptional(chatD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(chatD2, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD2, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD2, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD2, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD2, 'chat-message[]')).resolves.toStrictEqual([chatMessage2]);
    expect(expectTypeOptional(chatD2, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(chatD3, 'unknown')).resolves.toBe(chatMessage3);
    expect(expectTypeOptional(chatD3, 'string')).rejects.toThrow();
    expect(expectTypeOptional(chatD3, 'number')).rejects.toThrow();
    expect(expectTypeOptional(chatD3, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(chatD3, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(chatD3, 'context')).rejects.toThrow();
    expect(expectTypeOptional(chatD3, 'chat-message')).resolves.toBe(chatMessage3);
    expect(expectTypeOptional(chatD3, 'object')).rejects.toThrow();

    expect(expectTypeOptional(chatD3, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD3, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD3, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD3, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD3, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD3, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD3, 'chat-message[]')).resolves.toStrictEqual([chatMessage3]);
    expect(expectTypeOptional(chatD3, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(chatD4, 'unknown')).resolves.toBe(chatMessage4);
    expect(expectTypeOptional(chatD4, 'string')).rejects.toThrow();
    expect(expectTypeOptional(chatD4, 'number')).rejects.toThrow();
    expect(expectTypeOptional(chatD4, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(chatD4, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(chatD4, 'context')).rejects.toThrow();
    expect(expectTypeOptional(chatD4, 'chat-message')).resolves.toBe(chatMessage4);
    expect(expectTypeOptional(chatD4, 'object')).rejects.toThrow();

    expect(expectTypeOptional(chatD4, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD4, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD4, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD4, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD4, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD4, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(chatD4, 'chat-message[]')).resolves.toStrictEqual([chatMessage4]);
    expect(expectTypeOptional(chatD4, 'object[]')).rejects.toThrow();

    // HumanMessage
    const humanMessage1 = new HumanMessage('Hello, how are you?');
    const humanMessage2 = new HumanMessage({
        content: "I'm doing well, thank you!",
        name: 'Alice'
    });
    const humanMessage3 = new HumanMessage('');
    const humanMessage4: BaseMessageLike = ['human', 'Hello!'];
    const humanMessageD1: ChatMessageData = { type: 'chat-message', value: humanMessage1 }; 
    const humanMessageD2: ChatMessageData = { type: 'chat-message', value: humanMessage2 }; 
    const humanMessageD3: ChatMessageData = { type: 'chat-message', value: humanMessage3 }; 
    const humanMessageD4: ChatMessageData = { type: 'chat-message', value: humanMessage4 }; 
    expect(expectTypeOptional(humanMessageD1, 'unknown')).resolves.toBe(humanMessage1);
    expect(expectTypeOptional(humanMessageD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD1, 'chat-message')).resolves.toBe(humanMessage1);
    expect(expectTypeOptional(humanMessageD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD1, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD1, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD1, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD1, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD1, 'chat-message[]')).resolves.toStrictEqual([humanMessage1]);
    expect(expectTypeOptional(humanMessageD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD2, 'unknown')).resolves.toBe(humanMessage2);
    expect(expectTypeOptional(humanMessageD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD2, 'chat-message')).resolves.toBe(humanMessage2);
    expect(expectTypeOptional(humanMessageD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD2, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD2, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD2, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD2, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD2, 'chat-message[]')).resolves.toStrictEqual([humanMessage2]);
    expect(expectTypeOptional(humanMessageD2, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD3, 'unknown')).resolves.toBe(humanMessage3);
    expect(expectTypeOptional(humanMessageD3, 'string')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD3, 'number')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD3, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD3, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD3, 'context')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD3, 'chat-message')).resolves.toBe(humanMessage3);
    expect(expectTypeOptional(humanMessageD3, 'object')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD3, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD3, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD3, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD3, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD3, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD3, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(humanMessageD3, 'chat-message[]')).resolves.toStrictEqual([humanMessage3]);
    expect(expectTypeOptional(humanMessageD3, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD4, 'unknown')).resolves.toBe(humanMessage4);
    expect(expectTypeOptional(humanMessageD4, 'string')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'number')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'context')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'chat-message')).resolves.toBe(humanMessage4);
    expect(expectTypeOptional(humanMessageD4, 'object')).rejects.toThrow();

    expect(expectTypeOptional(humanMessageD4, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(humanMessageD4, 'chat-message[]')).resolves.toStrictEqual([humanMessage4]);
    expect(expectTypeOptional(humanMessageD4, 'object[]')).rejects.toThrow();

    // BotMessage
    const botMessage1 = new BotMessage('Hello, I am a bot.');
    const botMessage2 = new BotMessage({
        content: 'How can I assist you today?',
        name: 'AssistantBot'
    });
    const botMessage3 = new BotMessage('');
    const botMessage4: BaseMessageLike = ['assistant', 'Hello!'];
    const botMessageD1: ChatMessageData = { type: 'chat-message', value: botMessage1 }; 
    const botMessageD2: ChatMessageData = { type: 'chat-message', value: botMessage2 }; 
    const botMessageD3: ChatMessageData = { type: 'chat-message', value: botMessage3 }; 
    const botMessageD4: ChatMessageData = { type: 'chat-message', value: botMessage4 }; 
    expect(expectTypeOptional(botMessageD1, 'unknown')).resolves.toBe(botMessage1);
    expect(expectTypeOptional(botMessageD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD1, 'chat-message')).resolves.toBe(botMessage1);
    expect(expectTypeOptional(botMessageD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD1, 'unknown[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD1, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD1, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD1, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD1, 'chat-message[]')).resolves.toStrictEqual([botMessage1]);
    expect(expectTypeOptional(botMessageD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD2, 'unknown')).resolves.toBe(botMessage2);
    expect(expectTypeOptional(botMessageD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD2, 'chat-message')).resolves.toBe(botMessage2);
    expect(expectTypeOptional(botMessageD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD2, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD2, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD2, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD2, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD2, 'chat-message[]')).resolves.toStrictEqual([botMessage2]);
    expect(expectTypeOptional(botMessageD2, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD3, 'unknown')).resolves.toBe(botMessage3);
    expect(expectTypeOptional(botMessageD3, 'string')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD3, 'number')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD3, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD3, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD3, 'context')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD3, 'chat-message')).resolves.toBe(botMessage3);
    expect(expectTypeOptional(botMessageD3, 'object')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD3, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD3, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD3, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD3, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD3, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD3, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD3, 'chat-message[]')).resolves.toStrictEqual([botMessage3]);
    expect(expectTypeOptional(botMessageD3, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD4, 'unknown')).resolves.toBe(botMessage4);
    expect(expectTypeOptional(botMessageD4, 'string')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD4, 'number')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD4, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD4, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD4, 'context')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD4, 'chat-message')).resolves.toBe(botMessage4);
    expect(expectTypeOptional(botMessageD4, 'object')).rejects.toThrow();

    expect(expectTypeOptional(botMessageD4, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(botMessageD4, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD4, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD4, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD4, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD4, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(botMessageD4, 'chat-message[]')).resolves.toStrictEqual([botMessage4]);
    expect(expectTypeOptional(botMessageD4, 'object[]')).rejects.toThrow();

    // SystemMessage
    const systemMessage1 = new SystemMessage('This is a system message.');
    const systemMessage2 = new SystemMessage({
      content: 'Another system message.',
      name: 'System'
    });
    const systemMessage3 = new SystemMessage('');
    const systemMessage4: BaseMessageLike = ['system', 'Hello!'];
    const systemMessageD1: ChatMessageData = { type: 'chat-message', value: systemMessage1 }; 
    const systemMessageD2: ChatMessageData = { type: 'chat-message', value: systemMessage2 }; 
    const systemMessageD3: ChatMessageData = { type: 'chat-message', value: systemMessage3 }; 
    const systemMessageD4: ChatMessageData = { type: 'chat-message', value: systemMessage4 }; 
    expect(expectTypeOptional(systemMessageD1, 'unknown')).resolves.toBe(systemMessage1);
    expect(expectTypeOptional(systemMessageD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD1, 'chat-message')).resolves.toBe(systemMessage1);
    expect(expectTypeOptional(systemMessageD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD1, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD1, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD1, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD1, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD1, 'chat-message[]')).resolves.toStrictEqual([systemMessage1]);
    expect(expectTypeOptional(systemMessageD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD2, 'unknown')).resolves.toBe(systemMessage2);
    expect(expectTypeOptional(systemMessageD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD2, 'chat-message')).resolves.toBe(systemMessage2);
    expect(expectTypeOptional(systemMessageD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD2, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD2, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD2, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD2, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD2, 'chat-message[]')).resolves.toStrictEqual([systemMessage2]);
    expect(expectTypeOptional(systemMessageD2, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD3, 'unknown')).resolves.toBe(systemMessage3);
    expect(expectTypeOptional(systemMessageD3, 'string')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD3, 'number')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD3, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD3, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD3, 'context')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD3, 'chat-message')).resolves.toBe(systemMessage3);
    expect(expectTypeOptional(systemMessageD3, 'object')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD3, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD3, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD3, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD3, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD3, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD3, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD3, 'chat-message[]')).resolves.toStrictEqual([systemMessage3]);
    expect(expectTypeOptional(systemMessageD3, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD4, 'unknown')).resolves.toBe(systemMessage4);
    expect(expectTypeOptional(systemMessageD4, 'string')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD4, 'number')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD4, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD4, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD4, 'context')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD4, 'chat-message')).resolves.toBe(systemMessage4);
    expect(expectTypeOptional(systemMessageD4, 'object')).rejects.toThrow();

    expect(expectTypeOptional(systemMessageD4, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(systemMessageD4, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD4, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD4, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD4, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD4, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(systemMessageD4, 'chat-message[]')).resolves.toStrictEqual([systemMessage4]);
    expect(expectTypeOptional(systemMessageD4, 'object[]')).rejects.toThrow();


    // FunctionMessage
    const functionMessage1 = new FunctionMessage('This is a function message.');
    const functionMessage2 = new FunctionMessage({
        content: 'Another function message.',
        name: 'Function'
    });
    const functionMessage3 = new FunctionMessage('');
    const functionMessage4: BaseMessageLike = ['function', 'Hello!'];
    const functionMessageD1: ChatMessageData = { type: 'chat-message', value: functionMessage1 }; 
    const functionMessageD2: ChatMessageData = { type: 'chat-message', value: functionMessage2 }; 
    const functionMessageD3: ChatMessageData = { type: 'chat-message', value: functionMessage3 }; 
    const functionMessageD4: ChatMessageData = { type: 'chat-message', value: functionMessage4 }; 
    expect(expectTypeOptional(functionMessageD1, 'unknown')).resolves.toBe(functionMessage1);
    expect(expectTypeOptional(functionMessageD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD1, 'chat-message')).resolves.toBe(functionMessage1);
    expect(expectTypeOptional(functionMessageD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD1, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD1, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD1, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD1, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD1, 'chat-message[]')).resolves.toStrictEqual([functionMessage1]);
    expect(expectTypeOptional(functionMessageD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD2, 'unknown')).resolves.toBe(functionMessage2);
    expect(expectTypeOptional(functionMessageD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD2, 'chat-message')).resolves.toBe(functionMessage2);
    expect(expectTypeOptional(functionMessageD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD2, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD2, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD2, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD2, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD2, 'chat-message[]')).resolves.toStrictEqual([functionMessage2]);
    expect(expectTypeOptional(functionMessageD2, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD3, 'unknown')).resolves.toBe(functionMessage3);
    expect(expectTypeOptional(functionMessageD3, 'string')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD3, 'number')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD3, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD3, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD3, 'context')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD3, 'chat-message')).resolves.toBe(functionMessage3);
    expect(expectTypeOptional(functionMessageD3, 'object')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD3, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD3, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD3, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD3, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD3, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD3, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD3, 'chat-message[]')).resolves.toStrictEqual([functionMessage3]);
    expect(expectTypeOptional(functionMessageD3, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD4, 'unknown')).resolves.toBe(functionMessage4);
    expect(expectTypeOptional(functionMessageD4, 'string')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD4, 'number')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD4, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD4, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD4, 'context')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD4, 'chat-message')).resolves.toBe(functionMessage4);
    expect(expectTypeOptional(functionMessageD4, 'object')).rejects.toThrow();

    expect(expectTypeOptional(functionMessageD4, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(functionMessageD4, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD4, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD4, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD4, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD4, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(functionMessageD4, 'chat-message[]')).resolves.toStrictEqual([functionMessage4]);
    expect(expectTypeOptional(functionMessageD4, 'object[]')).rejects.toThrow();

    const object1: object = { key1: 'value' };
    const object2: object = { key2: 1, key3: true };
    const object3: object = { };
    const object4: object = { role: 'general', json: { role: 'general', content: 'general message' } };
    const objectD1: JSONObjectData = { type: 'object', value: object1 }; 
    const objectD2: JSONObjectData = { type: 'object', value: object2 }; 
    const objectD3: JSONObjectData = { type: 'object', value: object3 }; 
    const objectD4: JSONObjectData = { type: 'object', value: object4 };

    expect(expectTypeOptional(objectD1, 'unknown')).resolves.toBe(object1);
    expect(expectTypeOptional(objectD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'object')).resolves.toBe(object1);

    expect(expectTypeOptional(objectD1, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(objectD1, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD1, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD1, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD1, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD1, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD1, 'chat-message[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD1, 'object[]')).resolves.toStrictEqual([object1]);

    expect(expectTypeOptional(objectD2, 'unknown')).resolves.toBe(object2);
    expect(expectTypeOptional(objectD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'object')).resolves.toBe(object2);

    expect(expectTypeOptional(objectD2, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(objectD2, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD2, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD2, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD2, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD2, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD2, 'chat-message[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD2, 'object[]')).resolves.toStrictEqual([object2]);

    expect(expectTypeOptional(objectD3, 'unknown')).resolves.toBe(object3);
    expect(expectTypeOptional(objectD3, 'string')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'number')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'context')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'object')).resolves.toBe(object3);

    expect(expectTypeOptional(objectD3, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(objectD3, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD3, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD3, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD3, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD3, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD3, 'chat-message[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD3, 'object[]')).resolves.toStrictEqual([object3]);

    expect(expectTypeOptional(objectD4, 'unknown')).resolves.toBe(object4);
    expect(expectTypeOptional(objectD4, 'string')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'number')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'context')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'object')).resolves.toBe(object4);

    expect(expectTypeOptional(objectD4, 'unknown[]')).rejects.toThrow();
    expect(expectTypeOptional(objectD4, 'string[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD4, 'number[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD4, 'boolean[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD4, 'blob[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD4, 'context[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD4, 'chat-message[]')).rejects.toThrow(); 
    expect(expectTypeOptional(objectD4, 'object[]')).resolves.toStrictEqual([object4]);

    //undefined array
    const undefinedArray1: undefined[] = [undefined];
    const undefinedArray2: undefined[] = [undefined, undefined, undefined];
    const undefinedArrayD1: ArrayData = { type: 'unknown[]', value: undefinedArray1 };
    const undefinedArrayD2: ArrayData = { type: 'unknown[]', value: undefinedArray2 };

    expect(expectTypeOptional(undefinedArrayD1, 'unknown')).resolves.toStrictEqual([undefined]);
    expect(expectTypeOptional(undefinedArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(undefinedArrayD1, 'unknown[]')).resolves.toStrictEqual([undefined]);
    expect(expectTypeOptional(undefinedArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(undefinedArrayD2, 'unknown')).resolves.toStrictEqual([undefined, undefined, undefined]);
    expect(expectTypeOptional(undefinedArrayD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(undefinedArrayD2, 'unknown[]')).resolves.toStrictEqual([undefined, undefined, undefined]);
    expect(expectTypeOptional(undefinedArrayD2, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(undefinedArrayD2, 'object[]')).rejects.toThrow();

    const nullArray1: null[] = [null];
    const nullArray2: null[] = [null, null, null];
    const nullArrayD1: ArrayData = { type: 'unknown[]', value: nullArray1 };
    const nullArrayD2: ArrayData = { type: 'unknown[]', value: nullArray2 };

    expect(expectTypeOptional(nullArrayD1, 'unknown')).resolves.toStrictEqual([null]);
    expect(expectTypeOptional(nullArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(nullArrayD1, 'unknown[]')).resolves.toStrictEqual([null]);
    expect(expectTypeOptional(nullArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(nullArrayD2, 'unknown')).resolves.toStrictEqual([null, null, null]);
    expect(expectTypeOptional(nullArrayD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(nullArrayD2, 'unknown[]')).resolves.toStrictEqual([null, null, null]);
    expect(expectTypeOptional(nullArrayD2, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(nullArrayD2, 'object[]')).rejects.toThrow();

    const stringArray1: string[] = ['Hello!'];
    const stringArray2: string[] = ['Hello!', 'Hi', 'yeah.'];
    const stringArrayD1: ArrayData = { type: 'string[]', value: stringArray1 };
    const stringArrayD2: ArrayData = { type: 'string[]', value: stringArray2 };

    expect(expectTypeOptional(stringArrayD1, 'unknown')).resolves.toStrictEqual(['Hello!']);
    expect(expectTypeOptional(stringArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(stringArrayD1, 'unknown[]')).resolves.toStrictEqual(['Hello!']);
    expect(expectTypeOptional(stringArrayD1, 'string[]')).resolves.toStrictEqual(['Hello!']);
    expect(expectTypeOptional(stringArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD1, 'object[]')).rejects.toThrow();

    expect(expectTypeOptional(stringArrayD2, 'unknown')).resolves.toStrictEqual(['Hello!', 'Hi', 'yeah.']);
    expect(expectTypeOptional(stringArrayD2, 'string')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'number')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'context')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'object')).rejects.toThrow();

    expect(expectTypeOptional(stringArrayD2, 'unknown[]')).resolves.toStrictEqual(['Hello!', 'Hi', 'yeah.']);
    expect(expectTypeOptional(stringArrayD2, 'string[]')).resolves.toStrictEqual(['Hello!', 'Hi', 'yeah.']);
    expect(expectTypeOptional(stringArrayD2, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(stringArrayD2, 'object[]')).rejects.toThrow();

    const booleanArray1: boolean[] = [true, false, true];
    const booleanArrayD1: ArrayData = { type: 'boolean[]', value: booleanArray1 };
    expect(expectTypeOptional(booleanArrayD1, 'unknown')).resolves.toStrictEqual([true, false, true]);
    expect(expectTypeOptional(booleanArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(booleanArrayD1, 'unknown[]')).resolves.toStrictEqual([true, false, true]);
    expect(expectTypeOptional(booleanArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'boolean[]')).resolves.toStrictEqual([true, false, true]);
    expect(expectTypeOptional(booleanArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(booleanArrayD1, 'object[]')).rejects.toThrow();

    const numberArray1: number[] = [3.4, -1, 999];
    const numberArrayD1: ArrayData = { type: 'number[]', value: numberArray1 };
    expect(expectTypeOptional(numberArrayD1, 'unknown')).resolves.toStrictEqual([3.4, -1, 999]);
    expect(expectTypeOptional(numberArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(numberArrayD1, 'unknown[]')).resolves.toStrictEqual([3.4, -1, 999]);
    expect(expectTypeOptional(numberArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'number[]')).resolves.toStrictEqual([3.4, -1, 999]);
    expect(expectTypeOptional(numberArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(numberArrayD1, 'object[]')).rejects.toThrow();

    const blob2 = new Blob([], { type: 'text/plain' });
    const blob3 = new Blob(['hello', ' ', 'world'], { type: 'text/plain' });
    const blobArray1: Blob[] = [blob2, blob1, blob3];
    const blobArrayD1: ArrayData = { type: 'blob[]', value: blobArray1 };
    expect(expectTypeOptional(blobArrayD1, 'unknown')).resolves.toStrictEqual(blobArray1);
    expect(expectTypeOptional(blobArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(blobArrayD1, 'unknown[]')).resolves.toStrictEqual(blobArray1);
    expect(expectTypeOptional(blobArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'blob[]')).resolves.toStrictEqual(blobArray1);
    expect(expectTypeOptional(blobArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(blobArrayD1, 'object[]')).rejects.toThrow();

    const metadata2 = {
        key1: 'ge',
        key2: 'aa',
    };
    const pageContent2 = '';
    const context2 = new Context({
        pageContent: pageContent2,
        metadata: metadata2,
    });

    const metadata3 = {
        key1: 'ge',
        key2: 'aa',
    };
    const pageContent3 = 'false';
    const context3 = new Context({
        pageContent: pageContent3,
        metadata: metadata3,
    });

    const metadata4 = {
        key1: 'ge',
        key2: 'aa',
    };
    const pageContent4 = 'False';
    const context4 = new Context({
        pageContent: pageContent4,
        metadata: metadata4,
    });
    const contextArray1: Context[] = [context1, context2, context3, context4];
    const contextArrayD1: ArrayData = { type: 'context[]', value: contextArray1 };
    expect(expectTypeOptional(contextArrayD1, 'unknown')).resolves.toStrictEqual(contextArray1);
    expect(expectTypeOptional(contextArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(contextArrayD1, 'unknown[]')).resolves.toStrictEqual(contextArray1);
    expect(expectTypeOptional(contextArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'context[]')).resolves.toStrictEqual(contextArray1);
    expect(expectTypeOptional(contextArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(contextArrayD1, 'object[]')).rejects.toThrow();

    const chatMessageArray1: BaseMessageLike[] = [chatMessage4, humanMessage1, botMessage3, systemMessage4, functionMessage2];
    const chatMessageArrayD1: ArrayData = { type: 'chat-message[]', value: chatMessageArray1 };
    expect(expectTypeOptional(chatMessageArrayD1, 'unknown')).resolves.toStrictEqual(chatMessageArray1);
    expect(expectTypeOptional(chatMessageArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(chatMessageArrayD1, 'unknown[]')).resolves.toStrictEqual(chatMessageArray1);
    expect(expectTypeOptional(chatMessageArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(chatMessageArrayD1, 'chat-message[]')).resolves.toStrictEqual(chatMessageArray1);
    expect(expectTypeOptional(chatMessageArrayD1, 'object[]')).rejects.toThrow();

    const objectArray1: object[] = [object1, object2, object3, object4];
    const objectArrayD1: ArrayData = { type: 'object[]', value: objectArray1 };
    expect(expectTypeOptional(objectArrayD1, 'unknown')).resolves.toStrictEqual(objectArray1);
    expect(expectTypeOptional(objectArrayD1, 'string')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'number')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'boolean')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'blob')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'context')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'chat-message')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'object')).rejects.toThrow();

    expect(expectTypeOptional(objectArrayD1, 'unknown[]')).resolves.toStrictEqual(objectArray1);
    expect(expectTypeOptional(objectArrayD1, 'string[]')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'number[]')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'boolean[]')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'blob[]')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'context[]')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'chat-message[]')).rejects.toThrow();
    expect(expectTypeOptional(objectArrayD1, 'object[]')).resolves.toStrictEqual(objectArray1);

});
