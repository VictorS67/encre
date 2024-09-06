import { audioDescriptor } from '../components/descriptors/AudioDescriptor';
import { blobDescriptor } from '../components/descriptors/BlobDescriptor';
import { codeDescriptor } from '../components/descriptors/CodeDescriptor';
import { conditionDescriptor } from '../components/descriptors/ConditionDescriptor';
import { contextDescriptor } from '../components/descriptors/ContextDescriptor';
import { fileDescriptor } from '../components/descriptors/FileDescriptor';
import { imageDescriptor } from '../components/descriptors/ImageDescriptor';
import { markdownDescriptor } from '../components/descriptors/MarkdownDescriptor';
import { messageDescriptor } from '../components/descriptors/MessageDescriptor';
import { plainTextDescriptor } from '../components/descriptors/PlainTextDescriptor';
import { UIContext } from '../types/studio.type';
import {
  UIContextDescriptor,
  UIContextDescriptors,
} from '../types/uicontext.type';

const allUIContextDescriptors: UIContextDescriptors = {
  plain: plainTextDescriptor,
  markdown: markdownDescriptor,
  code: codeDescriptor,
  blob: blobDescriptor,
  context: contextDescriptor,
  message: messageDescriptor,
  image: imageDescriptor,
  audio: audioDescriptor,
  file: fileDescriptor,
  condition: conditionDescriptor,
};

export function useUIContextDescriptors(
  uiContexts: UIContext[],
): UIContextDescriptor<UIContext['type']>[] {
  return uiContexts.map(
    (uiContext) => allUIContextDescriptors[uiContext.type],
  ) as UIContextDescriptor<UIContext['type']>[];
}
