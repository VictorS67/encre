import { produce } from 'immer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { match, P } from 'ts-pattern';

import { useCanvasPosition } from './useCanvasPosition';
import { useCanvasViewBounds } from './useCanvasViewBounds';
import { useChangeCommentContent } from './useChangeCommentContent';
import { useChangeWireType } from './useChangeWireType';
import { useCommentColorCache } from './useCommentColorCache';
import { useCopyComments } from './useCopyComments';
import { useCopyNodes } from './useCopyNodes';
import { useDuplicateComments } from './useDuplicateComments';
import { useDuplicateNodes } from './useDuplicateNodes';
import { usePasteComments } from './usePasteComments';
import { usePasteNodes } from './usePasteNodes';
import { useStableCallback } from './useStableCallback';
import { canvasPositionState } from '../state/canvas';
import { commentsState, selectingCommentIdsState } from '../state/comment';
import {
  nodeMapState,
  nodesState,
  pinningNodeIdsState,
  selectingNodeIdsState,
} from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { removeWireDataState, selectingWireIdsState } from '../state/wire';
import { ContextMenuConfigContextData } from '../types/contextmenu.type';
import {
  GraphComment,
  Node,
  NodeBody,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
} from '../types/studio.type';
import { WireData, WireType } from '../types/wire.type';
import { fakeId } from '../utils/fakeId';
import { isNotNull } from '../utils/safeTypes';

export function useContextMenuNodeGraphHandler() {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [comments, setComments] = useRecoilState(commentsState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [selectingNodeIds, setSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );
  const [selectingCommentIds, setSelectingCommentIds] = useRecoilState(
    selectingCommentIdsState,
  );
  const nodeMap = useRecoilValue(nodeMapState);
  const [selectingWireIds, setSelectingWireIds] = useRecoilState(
    selectingWireIdsState,
  );
  const removeWireData = useSetRecoilState(removeWireDataState);
  const setPinningNodeIds = useSetRecoilState(pinningNodeIdsState);
  const [canvasPosition, setCanvasPosition] =
    useRecoilState(canvasPositionState);

  const { clientToCanvasPosition } = useCanvasPosition();
  const copyNodes = useCopyNodes();
  const pasteNodes = usePasteNodes();
  const duplicateNodes = useDuplicateNodes();
  const changeWireType = useChangeWireType();
  const copyComments = useCopyComments();
  const pasteComments = usePasteComments();
  const duplicateComments = useDuplicateComments();
  const { updateCommentColor } = useChangeCommentContent();

  const changeComments = useStableCallback((newComments: GraphComment[]) => {
    setComments?.(newComments);
  });

  const changeNodes = useStableCallback((newNodes: Node[]) => {
    setNodes?.(newNodes);
  });

  const addComment = useStableCallback(
    (commentType: string, position: { x: number; y: number }) => {
      // TODO: change this to globalNodeRegistry.create() from core
      const newCommentId: string = fakeId(17);
      const newComment: GraphComment = {
        id: newCommentId,
        title: 'This is a comment',
        description: 'this is a comment description',
        visualInfo: {
          position: {
            x: position.x,
            y: position.y,
            zIndex: 999,
          },
          size: {
            width: 500,
            height: 300,
          },
        },
        type: commentType as any,
        text: 'this is a comment content.',
      };

      changeComments?.([...comments, newComment]);
    },
  );

  const addCommentAsNodeGroup = useStableCallback((...nodeIds: string[]) => {
    const boundingBoxOfCopiedNodes = nodeIds.reduce(
      (acc, nId) => {
        const node = nodeMap[nId];

        return {
          minX: Math.min(acc.minX, node.visualInfo.position.x),
          minY: Math.min(acc.minY, node.visualInfo.position.y),
          maxX: Math.max(
            acc.maxX,
            node.visualInfo.position.x + (node.visualInfo.size.width ?? 200),
          ),
          maxY: Math.max(
            acc.maxY,
            node.visualInfo.position.y + (node.visualInfo.size.height ?? 200),
          ),
        };
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
      },
    );

    // TODO: change this to globalNodeRegistry.create() from core
    const newCommentId: string = fakeId(17);
    const newComment: GraphComment = {
      id: newCommentId,
      title: 'Group',
      visualInfo: {
        position: {
          x: boundingBoxOfCopiedNodes.minX - 15,
          y: boundingBoxOfCopiedNodes.minY - 60,
          zIndex: 999,
        },
        size: {
          width:
            boundingBoxOfCopiedNodes.maxX - boundingBoxOfCopiedNodes.minX + 30,
          height:
            boundingBoxOfCopiedNodes.maxY - boundingBoxOfCopiedNodes.minY + 70,
        },
      },
      type: 'plain',
      text: '',
    };

    changeComments?.([...comments, newComment]);
    setSelectingCommentIds([newCommentId]);
    setSelectingNodeIds([]);
  });

  const addNode = useStableCallback(
    (
      nodeType: string,
      nodeSubType: string,
      position: { x: number; y: number },
      registerArgs?: Record<string, unknown>,
    ) => {
      // TODO: change this to globalNodeRegistry.create() from core
      const newNodeId: string = fakeId(17);
      const newNode: Node = {
        id: newNodeId,
        type: nodeType,
        subType: nodeSubType,
        registerArgs: registerArgs,
        visualInfo: {
          position: {
            x: position.x,
            y: position.y,
            zIndex: 999,
          },
          size: {
            width: 300,
            height: 500,
          },
        },
        title: 'new node',
        name: 'new-node',
        aliases: {},
        secrets: {},
        kwargs: {},
        inputs: {
          input1: ['string'],
        },
        outputs: {
          output1: ['string'],
        },
        setKwarg: function (key: string, value: unknown): void {
          throw new Error('Function not implemented.');
        },
        getBody: async (): Promise<NodeBody> => {
          return [
            {
              type: 'code',
              text: `attr1: "1"
attr2: [2, 3]
attr3: true
attr4: [
  {
    "sub1": 1,
    "sub2": "2"
  },
  {
    "sub3": 3,
    "sub4": "4"
  }
]
attr6: `,
              language: 'encre-code',
              keywords: [
                'attr1',
                'attr2',
                'attr3',
                'attr4',
                'attr5',
                'attr6',
                'attr7',
                'attr8',
              ],
              isHoldingValues: true,
            },
          ];
        },
        getInputPortDefs: function (
          cs: NodeConnection[],
          ns: Record<string, Node>,
        ): NodeInputPortDef[] {
          return [
            {
              nodeId: newNodeId,
              name: 'input1',
              type: ['string'],
            },
          ];
        },
        getOutputPortDefs: function (
          cs: NodeConnection[],
          ns: Record<string, Node>,
        ): NodeOutputPortDef[] {
          return [
            {
              nodeId: newNodeId,
              name: 'output1',
              type: ['string'],
            },
          ];
        },
        validateInputs: function (
          inputs?: ProcessInputMap | undefined,
        ): boolean {
          throw new Error('Function not implemented.');
        },
        process: function (
          inputs: ProcessInputMap,
          context: ProcessContext,
        ): Promise<ProcessOutputMap> {
          throw new Error('Function not implemented.');
        },
      };

      changeNodes?.([...nodes, newNode]);
    },
  );

  const removeComments = useStableCallback((...commentIds: string[]) => {
    const newComments = [...comments];
    for (const commentId of commentIds) {
      const commentIdx = newComments.findIndex((n) => n.id === commentId);
      if (commentIdx >= 0) {
        newComments.splice(commentIdx, 1);
      }
    }

    changeComments?.(newComments);
  });

  const removeNodes = useStableCallback((...nodeIds: string[]) => {
    const newNodes = [...nodes];
    let newConnections = [...connections];
    for (const nodeId of nodeIds) {
      const nodeIdx = newNodes.findIndex((n) => n.id === nodeId);
      if (nodeIdx >= 0) {
        newNodes.splice(nodeIdx, 1);
      }

      newConnections = newConnections.filter(
        (c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId,
      );
    }

    changeNodes?.(newNodes);
    setConnections?.(newConnections);
  });

  const removeWires = useStableCallback((...wireIds: string[]) => {
    let newConnections = [...connections];

    for (const wireId of wireIds) {
      const parts = wireId.replace('wire-', '').split('-');
      if (parts.length !== 4) {
        continue;
      }

      const [fromNodeId, fromPortName, toNodeId, toPortName] = parts;
      newConnections = newConnections.filter(
        (c) =>
          c.fromNodeId !== fromNodeId ||
          c.fromPortName !== fromPortName ||
          c.toNodeId !== toNodeId ||
          c.toPortName !== toPortName,
      );

      removeWireData?.(wireId);
    }

    setConnections?.(newConnections);
  });

  const moveToNode = useStableCallback((nodeId: string) => {
    const node = nodeMap[nodeId];

    setCanvasPosition({
      ...canvasPosition,
      x:
        -node.visualInfo.position.x +
        (window.innerWidth - (node.visualInfo.size.width ?? 200)) / 2,
      y:
        -node.visualInfo.position.y +
        (window.innerHeight - (node.visualInfo.size.height ?? 200)) / 2,
    });
  });

  return useStableCallback(
    (
      menuItemId: string,
      context: ContextMenuConfigContextData,
      meta: { x: number; y: number },
      data: unknown,
    ) => {
      match(menuItemId)
        .with(P.string.startsWith('add-comment:'), () => {
          const { commentType } = data as {
            commentType: string;
          };

          addComment(commentType, clientToCanvasPosition(meta.x, meta.y));
        })
        .with('delete-comment', () => {
          if (!context.data) {
            return;
          }

          const { commentId } = context.data as {
            commentId: string;
          };
          const commentIds: string[] = (
            selectingCommentIds.length > 0
              ? [...new Set([...selectingCommentIds, commentId])]
              : [commentId]
          ).filter(isNotNull);

          removeComments(...commentIds);
          setSelectingCommentIds([]);
        })
        .with('paste-comment', () => {
          pasteComments(meta);
        })
        .with('copy-comment', () => {
          if (!context.data) {
            return;
          }

          const { commentId } = context.data as {
            commentId: string;
          };

          copyComments(commentId);
        })
        .with('duplicate-comment', () => {
          if (!context.data) {
            return;
          }

          const { commentId } = context.data as {
            commentId: string;
          };

          duplicateComments(commentId);
        })
        .with(P.string.startsWith('change-comment-color:'), () => {
          if (!context.data) {
            return;
          }

          const { commentId } = context.data as {
            commentId: string;
          };

          const { colorType } = data as {
            colorType: string;
          };

          const commentIds: string[] = (
            selectingCommentIds.length > 0
              ? [...new Set([...selectingCommentIds, commentId])]
              : [commentId]
          ).filter(isNotNull);

          for (const cId of commentIds) {
            updateCommentColor(cId, colorType);
          }
          changeComments(
            produce(comments, (draft) => {
              const commentToChange = draft.find((c) =>
                commentIds.includes(c.id),
              );

              if (commentToChange) {
                if (!commentToChange.visualInfo.content) {
                  commentToChange.visualInfo.content = {
                    color: colorType as any,
                  };
                } else {
                  commentToChange.visualInfo.content.color = colorType as any;
                }
              }
            }),
          );
        })
        .with(P.string.startsWith('add-node:'), () => {
          const { nodeType, nodeSubType, registerArgs } = data as {
            nodeType: string;
            nodeSubType: string;
            registerArgs?: Record<string, unknown>;
          };

          addNode(
            nodeType,
            nodeSubType,
            clientToCanvasPosition(meta.x, meta.y),
            registerArgs,
          );
        })
        .with('delete-node', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };
          const nodeIds: string[] = (
            selectingNodeIds.length > 0
              ? [...new Set([...selectingNodeIds, nodeId])]
              : [nodeId]
          ).filter(isNotNull);

          removeNodes(...nodeIds);
          setSelectingNodeIds([]);
        })
        .with('paste-node', () => {
          pasteNodes(meta);
        })
        .with('copy-node', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };

          copyNodes(nodeId);
        })
        .with('duplicate-node', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };

          duplicateNodes(nodeId);
        })
        .with('select-all-node', () => {
          const allNodeIds = nodes.map((n) => n.id);

          setSelectingNodeIds(allNodeIds);
        })
        .with('pin-unpin-node', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };

          const nodeIds: string[] = (
            selectingNodeIds.length > 0
              ? [...new Set([...selectingNodeIds, nodeId])]
              : [nodeId]
          ).filter(isNotNull);

          for (const nId of nodeIds) {
            setPinningNodeIds((prev) => {
              if (prev.includes(nId)) {
                return prev.filter((n) => n !== nId);
              }

              return [...prev, nId];
            });
          }
        })
        .with('bring-to-front', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };

          const maxZIndex: number = nodes.reduce((maxVal, node) => {
            const zIndex: number =
              node.visualInfo.position.zIndex &&
              !Number.isNaN(node.visualInfo.position.zIndex)
                ? node.visualInfo.position.zIndex
                : 0;

            return Math.max(maxVal, zIndex);
          }, 0);

          const nodeIds: string[] = (
            selectingNodeIds.length > 0
              ? [...new Set([...selectingNodeIds, nodeId])]
              : [nodeId]
          ).filter(isNotNull);

          changeNodes(
            nodes.map((node): Node => {
              return nodeIds.includes(node.id)
                ? {
                    ...node,
                    visualInfo: {
                      ...node.visualInfo,
                      position: {
                        ...node.visualInfo.position,
                        zIndex: maxZIndex + 1,
                      },
                    },
                  }
                : node;
            }),
          );
        })
        .with('send-to-back', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };

          const minZIndex: number = nodes.reduce((minVal, node) => {
            const zIndex: number =
              node.visualInfo.position.zIndex &&
              !Number.isNaN(node.visualInfo.position.zIndex)
                ? node.visualInfo.position.zIndex
                : 0;

            return Math.min(minVal, zIndex);
          }, 0);

          const nodeIds: string[] = (
            selectingNodeIds.length > 0
              ? [...new Set([...selectingNodeIds, nodeId])]
              : [nodeId]
          ).filter(isNotNull);

          changeNodes(
            nodes.map((node): Node => {
              return nodeIds.includes(node.id)
                ? {
                    ...node,
                    visualInfo: {
                      ...node.visualInfo,
                      position: {
                        ...node.visualInfo.position,
                        zIndex: minZIndex - 1,
                      },
                    },
                  }
                : node;
            }),
          );
        })
        .with('group-node', () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = context.data as {
            nodeId: string;
          };

          const nodeIds: string[] = (
            selectingNodeIds.length > 0
              ? [...new Set([...selectingNodeIds, nodeId])]
              : [nodeId]
          ).filter(isNotNull);

          addCommentAsNodeGroup(...nodeIds);
        })
        .with(P.string.startsWith('move-to-node:'), () => {
          if (!context.data) {
            return;
          }

          const { nodeId } = data as {
            nodeId: string;
          };

          moveToNode(nodeId);
        })
        .with(P.string.startsWith('change-wire-type:'), () => {
          if (!context.data) {
            return;
          }

          const { wireType } = data as {
            wireType: WireType;
          };

          const { wireId } = context.data as {
            wireId: string;
          };

          const wireIds: string[] = (
            selectingWireIds.length > 0
              ? [...new Set([...selectingWireIds, wireId])]
              : [wireId]
          ).filter(isNotNull);

          for (const wId of wireIds) {
            changeWireType(wId, wireType);
          }
        })
        .with('delete-wire', () => {
          if (!context.data) {
            return;
          }

          const { wireId } = context.data as {
            wireId: string;
          };
          const wireIds: string[] = (
            selectingWireIds.length > 0
              ? [...new Set([...selectingWireIds, wireId])]
              : [wireId]
          ).filter(isNotNull);

          removeWires(...wireIds);
          setSelectingWireIds([]);
        })
        .otherwise(() => {
          console.log(`Unknown menu item selected: ${menuItemId}`);
        });
    },
  );
}
