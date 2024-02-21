import { codeDescriptor } from '../components/descriptors/CodeDescriptor';
import { markdownDescriptor } from '../components/descriptors/MarkdownDescriptor';
import { plainTextDescriptor } from '../components/descriptors/PlainTextDescriptor';
import {
  UIContextDescriptor,
  UIContextDescriptors,
} from '../types/descriptor.type';
import { UIContext } from '../types/studio.type';

const allUIContextDescriptors: UIContextDescriptors = {
  plain: plainTextDescriptor,
  markdown: markdownDescriptor,
  code: codeDescriptor,
  blob: {
    Body: undefined,
    PopUpWindow: undefined,
  },
  context: {
    Body: undefined,
    PopUpWindow: undefined,
  },
  message: {
    Body: undefined,
    PopUpWindow: undefined,
  },
};

export function useUIContextDescriptors(
  uiContexts: UIContext[],
): UIContextDescriptor<UIContext['type']>[] {
  return uiContexts.map(
    (uiContext) => allUIContextDescriptors[uiContext.type],
  ) as UIContextDescriptor<UIContext['type']>[];
}
