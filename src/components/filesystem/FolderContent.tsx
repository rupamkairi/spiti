import { useQuery } from "convex/react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import CardBase from "../cards/CardBase";
import CreateNodeModal from "./CreateNodeModal";
import Button from "../editors/Buttons";

interface FolderContentProps {
  parentId: Id<"folders"> | null;
  title?: string;
}

export default function FolderContent({ parentId, title }: FolderContentProps) {
  const folders = useQuery(api.functions.folder.listFolders, {
    folderId: parentId,
  });
  const items = useQuery(api.functions.item.listItems, { folderId: parentId });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (folders === undefined || items === undefined) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isEmpty = folders.length === 0 && items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title ?? "Files"}</h1>
        <Button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New
        </Button>
      </div>

      {isEmpty ? (
        <div className="text-center py-12 bg-base-200 rounded-lg border-2 border-dashed border-base-300">
          <p className="text-base-content/60">This folder is empty</p>
          <Button
            className="btn btn-link btn-sm mt-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create something
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {folders.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-base-content/50 uppercase tracking-wider">
                Folders
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <Link
                    key={folder._id}
                    to="/folders/$folderId"
                    params={{ folderId: folder._id }}
                    className="block group"
                  >
                    <CardBase id={folder._id} title={folder.name} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-base-content/50 uppercase tracking-wider">
                Items
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <Link
                    key={item._id}
                    to="/items/$itemId"
                    params={{ itemId: item._id }}
                    className="block group"
                  >
                    <CardBase id={item._id} title={item.name} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateNodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        parentId={parentId}
      />
    </div>
  );
}
