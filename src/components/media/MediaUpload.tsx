import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function MediaUpload() {
  const generateUploadUrl = useMutation(api.functions.media.generateUploadUrl);
  const saveMedia = useMutation(api.functions.media.saveMedia);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      // Step 3: Save the newly allocated storage id to the database
      await saveMedia({
        storageId,
        name: selectedFile.name,
        type: selectedFile.type,
      });

      setSelectedFile(null);
      if (imageInput.current) imageInput.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title">Upload Media</h2>
        <form onSubmit={(e) => void handleUpload(e)} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Pick a file</span>
            </label>
            <input
              type="file"
              ref={imageInput}
              accept="image/*,video/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              disabled={isUploading}
            />
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <div className="card-actions justify-end">
            <button
              type="submit"
              className={`btn btn-primary ${isUploading ? "loading" : ""}`}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
