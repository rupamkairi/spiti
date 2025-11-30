import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
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
    };
  };
}) {
  const editItem = useMutation(api.functions.item.editItem);
  const [text, setText] = useState(props.item.content.text);

  return (
    <div>
      <p>Hello "/items/$itemId"! {props.item.itemId}</p>
      <button
        className="btn btn-secondary"
        onClick={() => {
          void editItem({
            item: {
              itemId: props.item.itemId,
              name: props.item.name,
              parentId: props.item.parentId,
              contentId: props.item.contentId,
              content: {
                text,
                content: "",
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
      <p>{props.item.name}</p>
      <EditText text={text} onChange={setText} />
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
