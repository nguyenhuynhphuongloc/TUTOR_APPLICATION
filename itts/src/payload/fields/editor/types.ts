import { type RichTextFieldClientProps } from "payload";

// import { SerializedEditorState, type EditorState, type LexicalEditor } from "lexical";

// import { type Comments, type CommentStore } from './commenting';

// import type { EditorConfig } from '../../types';

export type FieldProps = Omit<RichTextFieldClientProps, "type"> & {
  // editorConfig: EditorConfig;
  path?: string;
};

export type FieldValue = {
  editor: string;
  correctAnswers?: object;
  // preview: string;
  // characters: number;
  // words: number;
  // comments: Comments;
  // html?: string;
  // markdown?: string;
};
