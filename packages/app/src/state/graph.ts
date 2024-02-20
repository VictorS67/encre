import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

import { NodeGraph } from "../types/graph.type";

const { persistAtom } = recoilPersist({ key: "graph" });

export const graphState = atom<NodeGraph>({
  key: "graph",
  default: {
    nodes: [
      // TODO: remove this
      {
        id: "1",
        type: "prompt",
        subType: "string",
        title: "StringPrompt",
        name: "StringPrompt",
        aliases: {},
        secrets: {},
        kwargs: {
          value: {
            type: "string",
            value:
              "Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.",
          },
        },
        visualInfo: {
          position: {
            x: 100,
            y: 100,
            zIndex: 1,
          },
          size: {
            width: 300,
            height: 500,
          },
        },
        inputs: {},
        outputs: {
          prompt: ["string"],
        },
        // metadata: {
        //   name: 'StringPrompt',
        //   abbreviation: 'SP',
        //   tags: ['chat'],
        //   inputs: ['input'],
        //   outputs: ['output'],
        // },
        // type: 'text',
        // content:
        //   'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
      },
    ],
    connections: [],
  },
  effects: [persistAtom],
});
