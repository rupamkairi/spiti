import { createFileRoute } from "@tanstack/react-router";
import FolderContent from "@/components/filesystem/FolderContent";

export const Route = createFileRoute("/folders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FolderContent parentId={null} title="My Drive" />;
}
