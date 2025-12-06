import CardBase, { type CardBaseProps } from "@/components/cards/CardBase";
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

type ItemCardProps = CardBaseProps;

function ItemCard(props: ItemCardProps) {
  return (
    <Link to={"/items/" + props.id}>
      <CardBase {...props} />
    </Link>
  );
}
