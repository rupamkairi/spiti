import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/folders/")({
  component: RouteComponent,
});

function RouteComponent() {
  const folders = useQuery(api.functions.folder.listFolders, {
    folderId: null,
  });
  const createFolder = useMutation(api.functions.folder.createFolder);

  return (
    <div>
      <p>Hello "/folders/"!</p>
      <div>
        {folders?.map((folder) => (
          <div key={folder._id}>{folder.name}</div>
        ))}
      </div>
      <button
        className="btn btn-secondary"
        onClick={() => {
          void createFolder({ name: "New Folder", parentId: null });
        }}
      >
        Create Folder
      </button>
    </div>
  );
}
