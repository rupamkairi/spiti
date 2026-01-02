import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import FolderContent from "@/components/filesystem/FolderContent";

export const Route = createFileRoute("/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId } = Route.useParams();
  const folder = useQuery(api.functions.folder.getFolder, {
    folderId: folderId as Id<"folders">,
  });

  return (
    <FolderContent
      parentId={folderId as Id<"folders">}
      title={folder?.name ?? "Loading..."}
    />
  );
}
