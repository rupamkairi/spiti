import CardBase, { type CardBaseProps } from "@/components/cards/CardBase";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from "../../components/editors/Buttons";

export const Route = createFileRoute("/items/")({
  component: RouteComponent,
});

function RouteComponent() {
  const items = useQuery(api.functions.item.listItems, { folderId: null });
  const createItem = useMutation(api.functions.item.createItem);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Items</h1>
        <Button
          className="btn btn-primary"
          onClick={() => {
            void createItem({ name: "New Item", parentId: null });
          }}
        >
          Create Item
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items?.map((item) => (
          <div key={item._id}>
            <ItemCard id={item._id} title={item.name} />
          </div>
        ))}
      </div>
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
