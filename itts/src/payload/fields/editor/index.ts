import { type Field, type FieldBase } from "payload";

interface EditorConfig {
  debug: boolean;
  features: unknown[];
  output?: {
    html?: {
      enabled: boolean;
    };
    markdown?: {
      enabled: boolean;
    };
  };
  toggles: {
    comments: {
      enabled: boolean;
    };
    tables: {
      enabled: boolean;
      display: boolean;
    };
    upload: {
      enabled: boolean;
      display: boolean;
    };
    fontSize: {
      enabled: boolean;
      display: boolean;
    };
    font: {
      enabled: boolean;
      display: boolean;
    };
    align: {
      enabled: boolean;
      display: boolean;
    };
    textColor: {
      enabled: boolean;
      display: boolean;
    };
    textBackground: {
      enabled: boolean;
      display: boolean;
    };
  };
}

export const defaultEditorConfig: EditorConfig = {
  debug: true,
  output: {
    html: {
      enabled: false,
    },
    markdown: {
      enabled: false,
    },
  },
  features: [],
  toggles: {
    comments: {
      enabled: true,
    },
    tables: {
      enabled: true,
      display: false,
    },
    upload: {
      enabled: true,
      display: true,
    },
    fontSize: {
      enabled: true,
      display: true,
    },
    font: {
      enabled: true,
      display: true,
    },
    textColor: {
      enabled: true,
      display: true,
    },
    textBackground: {
      enabled: true,
      display: true,
    },
    align: {
      enabled: true,
      display: true,
    },
  },
};

export function editorField(
  args: Omit<FieldBase, "name"> & {
    name?: string;
    editorConfig?: (defaultEditorConfig: EditorConfig) => EditorConfig;
  },
): Field {
  const { name, label, admin, hooks, editorConfig, ...rest } = args;

  // const finalEditorConfig: EditorConfig =
  //   editorConfig == null
  //     ? defaultEditorConfig
  //     : editorConfig(defaultEditorConfig);

  return {
    name: name ?? "editor",
    type: "json",
    label: label ?? "Editor",
    ...rest,
    hooks: {
      ...hooks,
      // beforeChange: [updateLexicalRelationships],
      // afterRead: [populateLexicalRelationships],
    },
    admin: {
      ...admin,
      components: {
        Field: {
          path: "@/payload/fields/editor/FieldComponentLazy#LexicalRichTextFieldComponent",
          clientProps: {
            // editorConfig: finalEditorConfig,
          },
        },
        Cell: "@/payload/fields/editor/FieldComponentLazy#LexicalRichTextCell",
      },
    },
  };
}
