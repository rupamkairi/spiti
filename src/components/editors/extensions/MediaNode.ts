import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaNodeView } from "../MediaNodeView";

export interface MediaOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
  onMediaUpload?: (file: File) => Promise<string>;
  onMediaSelect?: () => Promise<string>;
}

export interface MediaAttributes {
  mediaId: string;
  type: string;
  caption?: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    media: {
      setMedia: (attributes: MediaAttributes) => ReturnType;
      unsetMedia: () => ReturnType;
    };
  }
}

export const MediaNode = Node.create<MediaOptions>({
  name: "media",
  group: "block",
  content: "inline*",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
      onMediaUpload: undefined,
      onMediaSelect: undefined,
    };
  },

  addAttributes() {
    return {
      mediaId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-id"),
        renderHTML: (attributes) => {
          if (!attributes.mediaId) {
            return {};
          }
          return {
            "data-media-id": attributes.mediaId,
          };
        },
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-type"),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }
          return {
            "data-media-type": attributes.type,
          };
        },
      },
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-media-caption"),
        renderHTML: (attributes) => {
          if (!attributes.caption) {
            return {};
          }
          return {
            "data-media-caption": attributes.caption,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-media-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "media-node",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaNodeView);
  },

  addCommands() {
    return {
      setMedia:
        (attributes: MediaAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
      unsetMedia:
        () =>
        ({ commands }) => {
          return commands.deleteSelection();
        },
    };
  },

  addProseMirrorPlugins() {
    return [];
  },
});
