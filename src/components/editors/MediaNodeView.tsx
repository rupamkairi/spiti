import { NodeViewWrapper } from "@tiptap/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ItemMediaPreview } from "../media/ItemMediaPreview";
import { Id } from "@/convex/_generated/dataModel";

interface MediaNodeViewProps {
  node: {
    attrs: {
      mediaId: string;
      caption?: string;
      type?: string;
    };
  };
  updateAttributes: (attrs: { caption?: string }) => void;
  selected: boolean;
}

export function MediaNodeView({
  node,
  updateAttributes,
  selected,
}: MediaNodeViewProps) {
  const { mediaId, caption } = node.attrs;

  const media = useQuery(api.functions.media.getMediaById, {
    mediaId: mediaId as Id<"media">,
  });

  if (!media) {
    return (
      <NodeViewWrapper className="media-node-wrapper">
        <div className="skeleton w-full h-48 rounded-lg"></div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="media-node-wrapper">
      <div className={`relative ${selected ? "ring-2 ring-primary" : ""}`}>
        <ItemMediaPreview
          mediaId={mediaId as Id<"media">}
          caption={caption}
          onCaptionChange={(newCaption) =>
            updateAttributes({ caption: newCaption })
          }
          size="large"
          showCaption={true}
        />
      </div>
    </NodeViewWrapper>
  );
}
