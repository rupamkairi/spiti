import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId } = Route.useParams();

  return <div>Hello "/folders/$folderId" {folderId}!</div>;
}
