import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function LinkUpload() {
  const saveMedia = useMutation(api.functions.media.saveMedia);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("link/youtube");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url || !name) return;

    setIsSubmitting(true);
    try {
      await saveMedia({
        url,
        name,
        type,
      });
      setUrl("");
      setName("");
      // Keep type as selected or reset? Keep for convenience.
    } catch (error) {
      console.error("Failed to save link:", error);
      alert("Failed to save link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add External Link</h2>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Link Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="link/youtube">YouTube</option>
              <option value="link/instagram">Instagram</option>
              <option value="link/other">Other URL</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Name / Title</span>
            </label>
            <input
              type="text"
              placeholder="Funny Cat Video"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">URL</span>
            </label>
            <input
              type="url"
              placeholder="https://..."
              className="input input-bordered w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="card-actions justify-end">
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
