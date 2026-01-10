import { createFileRoute } from "@tanstack/react-router";
import MediaUpload from "../../components/media/MediaUpload";
import LinkUpload from "../../components/media/LinkUpload";
import MediaList from "../../components/media/MediaList";
import { useState } from "react";

export const Route = createFileRoute("/media-gallery/")({
  component: MediaGalleryPage,
});

function MediaGalleryPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold">Media Gallery</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex w-full mb-4">
            <button
              className={`flex-1 btn btn-sm rounded-r-none ${activeTab === "upload" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>
            <button
              className={`flex-1 btn btn-sm rounded-l-none ${activeTab === "link" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setActiveTab("link")}
            >
              Add Link
            </button>
          </div>

          {activeTab === "upload" ? <MediaUpload /> : <LinkUpload />}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Media</h2>
          <MediaList />
        </div>
      </div>
    </div>
  );
}
