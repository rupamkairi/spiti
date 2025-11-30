import { createFileRoute, Link } from "@tanstack/react-router";
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
      <div className="grid grid-cols-4 gap-2">
        {items?.map((item) => (
          <div key={item._id}>
            <ItemCard id={item._id} title={item.name} />
          </div>
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

type ItemCardProps = {
  id: string;
  title: string;
};
function ItemCard(props: ItemCardProps) {
  return (
    <Link to={"/items/" + props.id}>
      <div className="card card-border hover:shadow bg-base-100 ">
        <div className="card-body">
          <p>{props.title}</p>
          <p className="overflow-hidden whitespace-nowrap text-ellipsis link link-primary">
            {props.id}
          </p>
        </div>
      </div>
    </Link>
  );
}
