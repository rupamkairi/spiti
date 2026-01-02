import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Button from "../editors/Buttons";

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: Id<"folders"> | null;
}

export default function CreateNodeModal({
  isOpen,
  onClose,
  parentId,
}: CreateNodeModalProps) {
  const createFolder = useMutation(api.functions.folder.createFolder);
  const createItem = useMutation(api.functions.item.createItem);

  const [type, setType] = useState<"folder" | "item">("folder");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      setIsLoading(true);
      try {
        if (type === "folder") {
          await createFolder({ name, parentId });
        } else {
          await createItem({ name, parentId });
        }
        setName("");
        onClose();
      } catch (error) {
        console.error("Failed to create:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create New</h3>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <span className="label-text font-semibold">Type:</span>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="type"
                    className="radio radio-primary"
                    checked={type === "folder"}
                    onChange={() => setType("folder")}
                  />
                  <span className="label-text">Folder</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="type"
                    className="radio radio-primary"
                    checked={type === "item"}
                    onChange={() => setType("item")}
                  />
                  <span className="label-text">Item</span>
                </label>
              </label>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter name..."
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="modal-action">
            <Button className="btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <Button onClick={onClose}>close</Button>
      </form>
    </dialog>
  );
}
