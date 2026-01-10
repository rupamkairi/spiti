import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Button from "./Buttons";
import { MediaNode } from "./extensions/MediaNode";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type RichTextMediaEditorProps = {
  value: string | null;
  onChange: (json: string) => void;
  placeholder?: string;
  itemId?: Id<"items">;
};

export default function RichTextMediaEditor(props: RichTextMediaEditorProps) {
  const generateUploadUrl = useMutation(api.functions.media.generateUploadUrl);
  const saveMedia = useMutation(api.functions.media.saveMedia);
  const attachMediaToItem = useMutation(api.functions.item.attachMediaToItem);

  const initialJson = (() => {
    try {
      return props.value ? JSON.parse(props.value) : undefined;
    } catch {
      return undefined;
    }
  })();

  const handleMediaUpload = async (file: File): Promise<string> => {
    const uploadUrl = await generateUploadUrl({});
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    const mediaId = await saveMedia({
      storageId,
      name: file.name,
      type: file.type,
    });

    if (props.itemId) {
      await attachMediaToItem({
        itemId: props.itemId,
        mediaId: mediaId!,
        caption: "",
        position: 0,
      });
    }

    return mediaId!;
  };

  const handleMediaSelect = async (): Promise<string> => {
    // This will be implemented with the media gallery modal
    // For now, we'll trigger a file input
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,video/*,audio/*";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const mediaId = await handleMediaUpload(file);
          resolve(mediaId);
        }
      };
      input.click();
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      MediaNode.configure({
        onMediaUpload: handleMediaUpload,
        onMediaSelect: handleMediaSelect,
      }),
    ],
    content: initialJson ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      props.onChange(JSON.stringify(json));
    },
  });

  if (!editor) return null;

  const insertMedia = async () => {
    try {
      const mediaId = await handleMediaSelect();
      editor
        .chain()
        .focus()
        .setMedia({
          mediaId,
          type: "image",
          caption: "",
        })
        .run();
    } catch (error) {
      console.error("Failed to insert media:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1 items-center border rounded-md p-1 bg-base-100">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          Strike
        </Button>
        <div className="divider divider-horizontal mx-1"></div>
        <Button onClick={() => void insertMedia()} active={false}>
          📷 Media
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none border rounded-md p-3 min-h-[200px] bg-base-100"
      />

      {props.placeholder && !editor.getText() && (
        <div className="text-base-content/50 text-sm -mt-8 ml-3 pointer-events-none">
          {props.placeholder}
        </div>
      )}
    </div>
  );
}
