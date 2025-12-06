import CardBase, { type CardBaseProps } from "@/components/cards/CardBase";
import { createFileRoute, Link } from "@tanstack/react-router";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Folders</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            void createFolder({ name: "New Folder", parentId: null });
          }}
        >
          Create Folder
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {folders?.map((folder) => (
          <div key={folder._id}>
            <FolderCard id={folder._id} title={folder.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

type FolderCardProps = CardBaseProps;

function FolderCard(props: FolderCardProps) {
  return (
    <Link to={"/folders/" + props.id}>
      <CardBase {...props} />
    </Link>
  );
}
