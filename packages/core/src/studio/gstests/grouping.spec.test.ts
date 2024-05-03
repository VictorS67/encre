import { describe, expect, it, test } from '@jest/globals';
import { RecordId } from '../../load/keymap';
import { SubGraph } from '../graph';
import { NodeConnection } from '../nodes';
import { globalNodeRegistry } from '../registration/nodes';
import { grouping } from './grouping';

test('test assign nodes to one worker', async () => {
  // Create the nodes and connections for the test
  const pdfLoaderNode = globalNodeRegistry.createDynamic('loader', 'pdf');
  const textSplitterNode = globalNodeRegistry.createDynamic('splitter', 'text');

  const connection: NodeConnection = {
    fromNodeId: pdfLoaderNode.id,
    fromPortName: 'contexts',
    toNodeId: textSplitterNode.id,
    toPortName: 'input',
  };

  const graph = new SubGraph({
    nodes: [pdfLoaderNode, textSplitterNode],
    connections: [connection],
  });

  // Define the nodeInfo object
  const nodeInfo: { [key: number]: number } = {
    100: 10,
    200: 10,
    300: 10,
    400: 10,
    500: 10,
    600: 10,
  };

  // Call the grouping function
  const [groupSet, criticalPathFunction] = grouping(graph, nodeInfo);

  expect(graph.nodes.map((n) => ({ id: n.id, name: n.data._id }))).toMatchSnapshot();
  expect(groupSet).toMatchSnapshot();
  expect(criticalPathFunction).toMatchSnapshot();

  // Assert the expected results
  expect(groupSet.length).toEqual(1);
});

test('test assign nodes to two workers', async () => {
  // Create the nodes and connections for the test
  const pdfLoaderNode = globalNodeRegistry.createDynamic('loader', 'pdf');
  const textSplitterNode = globalNodeRegistry.createDynamic('splitter', 'text');

  const pdfLoaderNode2 = globalNodeRegistry.createDynamic('loader', 'pdf');
  const textSplitterNode2 = globalNodeRegistry.createDynamic(
    'splitter',
    'text'
  );

  const connection: NodeConnection = {
    fromNodeId: pdfLoaderNode.id,
    fromPortName: 'contexts',
    toNodeId: textSplitterNode.id,
    toPortName: 'input',
  };

  const connection2: NodeConnection = {
    fromNodeId: pdfLoaderNode2.id,
    fromPortName: 'contexts',
    toNodeId: textSplitterNode2.id,
    toPortName: 'input',
  };

  const graph = new SubGraph({
    nodes: [pdfLoaderNode, textSplitterNode, pdfLoaderNode2, textSplitterNode2],
    connections: [connection, connection2],
  });

  // Define the nodeInfo object
  const nodeInfo: { [key: number]: number } = {
    100: 10,
    200: 10,
    300: 10,
    400: 10,
    500: 10,
    600: 10,
  };

  // Call the grouping function
  const [groupSet, criticalPathFunction] = grouping(graph, nodeInfo);

  expect(graph.nodes.map((n) => ({ id: n.id, name: n.data._id }))).toMatchSnapshot();
  expect(groupSet).toMatchSnapshot();
  expect(criticalPathFunction).toMatchSnapshot();

  // Assert the expected results
  expect(groupSet.length).toEqual(2);
});
