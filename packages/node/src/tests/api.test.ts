import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test, expect } from '@jest/globals';
import {
  getAudioTypes,
  getDataTypes,
  getExtMap,
  getFileTypes,
  getGuardrailRegistry,
  getImageTypes,
  getNodeRegistry,
  getScalarTypes,
  getUIDataTypesMap,
  loadGraph,
} from '../index.js';

describe('utils', () => {
  test('load graph', async () => {
    const testDir = dirname(fileURLToPath(import.meta.url));
    const filePath = join(testDir, './Untitled Graph.encre');

    const graph = await loadGraph(filePath);

    expect(graph.title).toBe('Untitled Graph');
    expect(graph._id).toStrictEqual(['studio', 'graph', 'SubGraph']);
    expect(graph.nodes.length).toBe(2);
    expect(graph.connections.length).toBe(1);

    expect(graph.nodes[0]?.data._id).toStrictEqual([
      'events',
      'input',
      'load',
      'prompts',
      'text',
      'StringPrompt',
    ]);
    expect(graph.nodes[1]?.data._id).toStrictEqual([
      'events',
      'inference',
      'chat',
      'chatlms',
      'openai',
      'OpenAIChat',
    ]);
  });
});

describe('apis', () => {
  test('getNodeRegistry', () => {
    const registry = getNodeRegistry();
    const nodeTypes = Array.from(registry.nodeTypes);

    expect(nodeTypes).toContain('input');
    expect(nodeTypes).toContain('message');
    expect(nodeTypes).toContain('if');
    expect(nodeTypes).toContain('prompt');
    expect(nodeTypes).toContain('chatlm');
    expect(nodeTypes).toContain('llm');
    expect(nodeTypes).toContain('variable-validator');
    expect(nodeTypes).toContain('loader');
  });

  test('getGuardrailRegistry', () => {
    const registry = getGuardrailRegistry();
    const guardrailTypes = Array.from(registry.guardrailTypes);

    expect(guardrailTypes).toContain('string');
    expect(guardrailTypes).toContain('number');
    expect(guardrailTypes).toContain('boolean');
    expect(guardrailTypes).toContain('object');
    expect(guardrailTypes).toContain('array');
  });

  test('getDataTypes', () => {
    const dataTypes = getDataTypes();

    expect(dataTypes).toStrictEqual([
      'string',
      'string[]',
      'number',
      'number[]',
      'boolean',
      'boolean[]',
      'unknown',
      'unknown[]',
      'object',
      'object[]',
      'blob',
      'blob[]',
      'context',
      'context[]',
      'chat-message',
      'chat-message[]',
    ]);
  });

  test('getScalarTypes', () => {
    const scalarTypes = getScalarTypes();

    expect(scalarTypes).toStrictEqual([
      'string',
      'number',
      'boolean',
      'unknown',
      'object',
      'blob',
      'context',
      'chat-message',
    ]);
  });

  test('getImageTypes', () => {
    const imageTypes = getImageTypes();

    expect(imageTypes).toStrictEqual([
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
    ]);
  });

  test('getAudioTypes', () => {
    const audioTypes = getAudioTypes();

    expect(audioTypes).toStrictEqual(['audio/mp3', 'audio/ogg', 'audio/wav']);
  });

  test('getFileTypes', () => {
    const fileTypes = getFileTypes();

    expect(fileTypes).toStrictEqual([
      'text/plain',
      'text/html',
      'text/javascript',
      'text/css',
      'application/json',
      'application/pdf',
      'application/xml',
    ]);
  });

  test('getUIDataTypesMap', () => {
    const UIDataTypesMap = getUIDataTypesMap();

    expect(UIDataTypesMap).toStrictEqual({
      string: 'code',
      number: 'code',
      boolean: 'code',
      object: 'code',
      unknown: 'code',
      blob: 'blob',
      context: 'context',
      'chat-message': 'message',
      'string[]': 'code',
      'number[]': 'code',
      'boolean[]': 'code',
      'object[]': 'code',
      'unknown[]': 'code',
      'blob[]': 'blob',
      'context[]': 'context',
      'chat-message[]': 'message',
    });
  });

  test('getExtMap', () => {
    const extMap = getExtMap();

    expect(extMap).toStrictEqual({
      'text/plain': 'bin',
      'text/html': 'html',
      'text/javascript': 'js',
      'text/css': 'css',
      'application/json': 'json',
      'application/pdf': 'pdf',
      'application/xml': 'xml',
      'image/png': 'png',
      'image/jpeg': 'jpeg',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'audio/mp3': 'mp3',
      'audio/ogg': 'ogg',
      'audio/wav': 'wav',
    });
  });
});
