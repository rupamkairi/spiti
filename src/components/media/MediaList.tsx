import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ImagePreview,
  VideoPreview,
  AudioPreview,
  DefaultFilePreview,
} from "./previews/FilePreview";
import { EmbedPreview } from "./previews/EmbedPreview";

export default function MediaList() {
  const mediaItems = useQuery(api.functions.media.listMedia);
  const deleteMedia = useMutation(api.functions.media.deleteMedia);

  if (mediaItems === undefined) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        No media found. Upload some files or add links to get started!
      </div>
    );
  }

  const renderPreview = (item: (typeof mediaItems)[0]) => {
    // If no URL, we can't show much beyond a placeholder
    if (!item.url) {
      return <DefaultFilePreview type={item.type} />;
    }

    if (item.type.startsWith("image")) {
      return <ImagePreview url={item.url} name={item.name} type={item.type} />;
    }
    if (item.type.startsWith("video")) {
      return <VideoPreview url={item.url} name={item.name} type={item.type} />;
    }
    if (item.type.startsWith("audio")) {
      return <AudioPreview url={item.url} name={item.name} type={item.type} />;
    }
    if (item.type.startsWith("link/")) {
      return <EmbedPreview url={item.url} type={item.type} />;
    }

    return <DefaultFilePreview type={item.type} />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaItems.map((item) => (
        <div
          key={item._id}
          className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <figure className="aspect-square bg-base-200 overflow-hidden relative group">
            {renderPreview(item)}
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this media?")) {
                  void deleteMedia({
                    mediaId: item._id,
                    storageId: item.storageId,
                  });
                }
              }}
              className="btn btn-circle btn-error btn-xs absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Delete"
            >
              ✕
            </button>
          </figure>
          <div className="card-body p-4">
            <h3 className="card-title text-sm truncate block" title={item.name}>
              {item.name}
            </h3>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-base-content/60 uppercase font-bold">
                {item.type.includes("/") ? item.type.split("/")[1] : item.type}
              </span>
              <div className="text-xs text-base-content/60">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
