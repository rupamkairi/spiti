import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import RichTextEditor from "../../components/editors/RichTextEditor";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const Route = createFileRoute("/items/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const itemId = Route.useParams().itemId as Id<"items">;

  const getItem = useQuery(api.functions.item.getItem, { itemId });

  const item = {
    itemId: getItem?.item?._id as Id<"items">,
    parentId: getItem?.item?.parentId as Id<"folders"> | null,
    name: getItem?.item?.name as string,
    contentId: getItem?.item?.contentId as Id<"content">,
    content: {
      text: getItem?.content?.text as string,
      content: (getItem?.content?.content as string) ?? "",
    },
  };

  if (!getItem) {
    return <div>Loading...</div>;
  }

  return <ItemForm key={itemId} item={item} />;
}

function ItemForm(props: {
  item: {
    itemId: Id<"items">;
    name: string;
    parentId: Id<"folders"> | null;
    contentId: Id<"content">;
    content: {
      text: string;
      content: string;
    };
  };
}) {
  const editItem = useMutation(api.functions.item.editItem);
  const [text, setText] = useState(props.item.content.text);
  const [contentJson, setContentJson] = useState<string>(
    props.item.content.content ?? "",
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{props.item.name}</h1>
          <p className="text-sm text-base-300">{props.item.itemId}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            void editItem({
              item: {
                itemId: props.item.itemId,
                name: props.item.name,
                parentId: props.item.parentId,
                contentId: props.item.contentId,
                content: {
                  text,
                  content:
                    contentJson ||
                    JSON.stringify({
                      type: "doc",
                      content: [{ type: "paragraph" }],
                    }),
                  photos: [],
                  videos: [],
                  updatedAt: new Date().toISOString(),
                },
              },
            });
          }}
        >
          Save
        </button>
      </div>
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body space-y-4">
          <RichTextEditor value={contentJson} onChange={setContentJson} />
          <div className="form-control">
            <label className="label">
              <span className="label-text">Plain text summary</span>
            </label>
            <EditText text={text} onChange={setText} />
          </div>
        </div>
      </div>
    </div>
  );
}

type EditTextProps = {
  text: string;
  onChange: (text: string) => void;
};

function EditText(props: EditTextProps) {
  return (
    <div>
      <textarea
        value={props.text}
        className="textarea"
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      ></textarea>
      {/* <pre>{JSON.stringify({ text: props.text, props }, null, 2)}</pre> */}
    </div>
  );
}
