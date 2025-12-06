import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Button from "./Buttons";

export type RichTextEditorProps = {
  value: string | null;
  onChange: (json: string) => void;
  placeholder?: string;
};

export default function RichTextEditor(props: RichTextEditorProps) {
  const initialJson = (() => {
    try {
      return props.value ? JSON.parse(props.value) : undefined;
    } catch {
      return undefined;
    }
  })();

  const editor = useEditor({
    extensions: [StarterKit],
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
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          Code
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          • List
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. List
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          Quote
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          HR
        </Button>
        <Button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </Button>
      </div>
      <div className="border rounded-md p-2 bg-base-100">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
