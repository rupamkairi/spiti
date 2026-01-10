import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ImagePreview,
  VideoPreview,
  AudioPreview,
  DefaultFilePreview,
} from "./previews/FilePreview";
import { EmbedPreview } from "./previews/EmbedPreview";

interface ItemMediaPreviewProps {
  mediaId: Id<"media">;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  showCaption?: boolean;
}

export function ItemMediaPreview({
  mediaId,
  caption,
  onCaptionChange,
  className = "",
  size = "medium",
  showCaption = true,
}: ItemMediaPreviewProps) {
  const media = useQuery(api.functions.media.getMediaById, { mediaId });

  if (!media) {
    return (
      <div className={`skeleton ${getSizeClasses(size)} ${className}`}></div>
    );
  }

  const renderPreview = () => {
    if (!media.url) {
      return <DefaultFilePreview type={media.type} />;
    }

    if (media.type.startsWith("image")) {
      return (
        <ImagePreview url={media.url} name={media.name} type={media.type} />
      );
    }
    if (media.type.startsWith("video")) {
      return (
        <VideoPreview url={media.url} name={media.name} type={media.type} />
      );
    }
    if (media.type.startsWith("audio")) {
      return (
        <AudioPreview url={media.url} name={media.name} type={media.type} />
      );
    }
    if (media.type.startsWith("link/")) {
      return <EmbedPreview url={media.url} type={media.type} />;
    }
    return <DefaultFilePreview type={media.type} />;
  };

  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`${sizeClasses} ${className}`}>
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {renderPreview()}
      </div>
      {showCaption && caption && (
        <div className="mt-2 text-sm text-base-content/70">
          {onCaptionChange ? (
            <input
              type="text"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              className="input input-sm w-full"
              placeholder="Add caption..."
            />
          ) : (
            <p className="truncate">{caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

function getSizeClasses(size: ItemMediaPreviewProps["size"]): string {
  switch (size) {
    case "small":
      return "w-24 h-24";
    case "medium":
      return "w-48 h-48";
    case "large":
      return "w-64 h-64";
    default:
      return "w-48 h-48";
  }
}
