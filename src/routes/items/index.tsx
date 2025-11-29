import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/items/")({
  component: RouteComponent,
});

function RouteComponent() {
  const items = useQuery(api.functions.item.listItems, { folderId: null });
  const createItem = useMutation(api.functions.item.createItem);

  return (
    <div>
      <p>Hello "/$item/"!</p>
      <div>
        {items?.map((item) => (
          <div key={item._id}>{item.name}</div>
        ))}
      </div>
      <button
        className="btn btn-secondary"
        onClick={() => {
          void createItem({ name: "New Item", parentId: null });
        }}
      >
        Create Item
      </button>
    </div>
  );
}
