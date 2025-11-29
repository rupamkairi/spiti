import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();

  return <div>Hello "/items/$itemId"! {itemId}</div>;
}
