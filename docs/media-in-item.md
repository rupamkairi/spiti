# Media Integration in Items - Design Plan

## Overview

This document outlines the comprehensive plan for integrating media support into the item system and enabling media uploads within the RichText Editor. The design follows SOLID principles and maintains type safety throughout the implementation.

## Current State Analysis

### Media System

- **Location**: `/convex/functions/media.ts`
- **Capabilities**:
  - File uploads (images, videos, audio)
  - External link support (YouTube, Instagram)
  - Preview components for different media types
  - Secure storage with user authentication

### Item System

- **Location**: `/convex/functions/item.ts`
- **Current Structure**:
  - Items have associated content (text, JSON content)
  - Content includes photos/videos arrays (currently unused strings)
  - RichText Editor supports basic formatting

### Preview Components

- **Location**: `/src/components/media/previews/`
- **Available Components**:
  - `ImagePreview`, `VideoPreview`, `AudioPreview` for file types
  - `EmbedPreview` for external links (YouTube, Instagram)
  - `DefaultFilePreview` for unsupported types

## Design Goals

1. **Media-Item Integration**: Enable items to reference and display media
2. **RichText Editor Enhancement**: Add media upload capabilities to the editor
3. **Type Safety**: Maintain strict TypeScript typing throughout
4. **SOLID Compliance**: Follow single responsibility, open/closed principles
5. **Reusability**: Leverage existing preview components and media system

## Architecture Design

### 1. Schema Modifications

#### New Junction Table: `item_media`

```typescript
item_media: defineTable({
  itemId: v.id("items"),
  mediaId: v.id("media"),
  position: v.optional(v.number()), // For ordering within item
  caption: v.optional(v.string()), // Optional caption for media
  createdAt: v.string(),
})
  .index("by_itemId", ["itemId"])
  .index("by_mediaId", ["mediaId"]);
```

#### Modified Content Schema

Update the content table to support rich media references:

```typescript
content: defineTable({
  text: v.string(),
  content: v.string(), // Rich text JSON
  mediaIds: v.array(v.id("media")), // Direct media references
  photos: v.array(v.string()), // Legacy - can be migrated
  videos: v.array(v.string()), // Legacy - can be migrated
  createdAt: v.string(),
  updatedAt: v.union(v.string(), v.null()),
});
```

### 2. Backend Functions

#### New Functions in `item.ts`

```typescript
// Attach media to item
attachMediaToItem: mutation({
  args: {
    itemId: v.id("items"),
    mediaId: v.id("media"),
    position: v.optional(v.number()),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify ownership and attach media
  },
});

// Get media for item
getItemMedia: query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    // Return media items with preview URLs
  },
});

// Detach media from item
detachMediaFromItem: mutation({
  args: { itemId: v.id("items"), mediaId: v.id("media") },
  handler: async (ctx, args) => {
    // Remove media association
  },
});
```

#### Enhanced `getItem` Function

Modify to include media data:

```typescript
export const getItem = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    // Existing logic...

    // Get associated media
    const itemMedia = await ctx.db
      .query("item_media")
      .withIndex("by_itemId", (q) => q.eq("itemId", args.itemId))
      .collect();

    const mediaItems = await Promise.all(
      itemMedia.map(async (im) => {
        const media = await ctx.db.get(im.mediaId);
        if (!media) return null;

        return {
          ...media,
          url: media.storageId
            ? await ctx.storage.getUrl(media.storageId)
            : media.url,
          caption: im.caption,
          position: im.position,
        };
      }),
    );

    return { item, content, media: mediaItems.filter(Boolean) };
  },
});
```

### 3. RichText Editor Enhancement

#### New Component: `RichTextMediaEditor`

```typescript
interface RichTextMediaEditorProps {
  value: string | null;
  onChange: (json: string) => void;
  onMediaUpload: (file: File) => Promise<string>; // Returns media ID
  onMediaSelect: () => Promise<string>; // Returns media ID from gallery
  mediaPreviewComponent?: React.ComponentType<{ mediaId: string }>;
}
```

#### TipTap Extensions

Create custom extensions for media:

```typescript
// Media node extension
MediaNode.configure({
  inline: false,
  group: "block",
  draggable: true,
  attrs: {
    mediaId: { default: null },
    type: { default: null },
    caption: { default: null },
  },
});
```

### 4. Preview Wrapper Component

#### New Component: `ItemMediaPreview`

```typescript
interface ItemMediaPreviewProps {
  mediaId: string;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
  className?: string;
}

// Wrapper that selects appropriate preview component
export function ItemMediaPreview({ mediaId, caption, onCaptionChange, className }: ItemMediaPreviewProps) {
  const media = useQuery(api.functions.media.getMediaById, { mediaId });

  if (!media) return <div className="skeleton h-32 w-full"></div>;

  const renderPreview = () => {
    if (media.type.startsWith("image")) {
      return <ImagePreview url={media.url!} name={media.name} type={media.type} />;
    }
    if (media.type.startsWith("video")) {
      return <VideoPreview url={media.url!} name={media.name} type={media.type} />;
    }
    if (media.type.startsWith("audio")) {
      return <AudioPreview url={media.url!} name={media.name} type={media.type} />;
    }
    if (media.type.startsWith("link/")) {
      return <EmbedPreview url={media.url!} type={media.type} />;
    }
    return <DefaultFilePreview type={media.type} />;
  };

  return (
    <div className={className}>
      <div className="relative">
        {renderPreview()}
      </div>
      {caption && (
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
            <p>{caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### 5. UI Components

#### Media Upload Button for RichText Editor

```typescript
interface MediaUploadButtonProps {
  onMediaAdded: (mediaId: string) => void;
}

export function MediaUploadButton({ onMediaAdded }: MediaUploadButtonProps) {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <>
      <Button onClick={() => setShowUploader(true)}>
        📷 Add Media
      </Button>

      {showUploader && (
        <MediaUploadModal
          onClose={() => setShowUploader(false)}
          onMediaUploaded={onMediaAdded}
        />
      )}
    </>
  );
}
```

#### Media Gallery Selector

```typescript
interface MediaGallerySelectorProps {
  onMediaSelected: (mediaId: string) => void;
  onClose: () => void;
}

export function MediaGallerySelector({ onMediaSelected, onClose }: MediaGallerySelectorProps) {
  const mediaItems = useQuery(api.functions.media.listMedia);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-lg">Select Media</h3>
        <div className="grid grid-cols-3 gap-4 mt-4 max-h-96 overflow-y-auto">
          {mediaItems?.map((media) => (
            <div
              key={media._id}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onMediaSelected(media._id)}
            >
              <ItemMediaPreview mediaId={media._id} className="h-24" />
              <p className="text-xs mt-1 truncate">{media.name}</p>
            </div>
          ))}
        </div>
        <div className="modal-action">
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
```

## Implementation Phases

### Phase 1: Schema and Backend (Week 1)

1. Create `item_media` junction table
2. Update content schema with `mediaIds` array
3. Implement backend functions for media-item relationships
4. Update `getItem` to include media data
5. Add migration utilities for existing content

### Phase 2: Preview Components (Week 1-2)

1. Create `ItemMediaPreview` wrapper component
2. Implement caption editing functionality
3. Add responsive sizing options
4. Create loading and error states
5. Write comprehensive tests

### Phase 3: RichText Editor Integration (Week 2)

1. Create TipTap media extension
2. Implement `RichTextMediaEditor` component
3. Add media upload button to toolbar
4. Create media gallery selector modal
5. Handle drag-and-drop functionality

### Phase 4: Enhanced Item View (Week 2-3)

1. Update `/items/$itemId.tsx` to display media
2. Implement media grid layout
3. Add media management UI (reorder, caption edit, delete)
4. Create responsive layouts for different screen sizes
5. Optimize loading performance

### Phase 5: Testing and Polish (Week 3)

1. Write unit tests for all new functions
2. Create integration tests for media workflows
3. Performance testing with large media collections
4. Accessibility audit
5. Documentation and examples

## Type Safety Considerations

### New Types

```typescript
// Media item with resolved URL
interface MediaItemWithUrl extends Doc<"media"> {
  url: string;
  caption?: string;
  position?: number;
}

// RichText media node
interface MediaNodeAttrs {
  mediaId: string;
  type: string;
  caption?: string;
}

// Item content with media
interface ItemContentWithMedia {
  text: string;
  content: string; // JSON
  media: MediaItemWithUrl[];
}
```

### Type Guards

```typescript
function isMediaNode(node: any): node is { attrs: MediaNodeAttrs } {
  return node?.type === "media" && node?.attrs?.mediaId;
}

function isValidMediaType(type: string): boolean {
  return (
    type.startsWith("image/") ||
    type.startsWith("video/") ||
    type.startsWith("audio/") ||
    type.startsWith("link/")
  );
}
```

## SOLID Principles Compliance

### Single Responsibility Principle

- Each component handles one specific aspect (preview, upload, selection)
- Backend functions have single, focused purposes
- Schema tables represent distinct entities

### Open/Closed Principle

- Preview components are extensible for new media types
- TipTap extensions can be added without modifying core editor
- Media types can be extended without breaking existing functionality

### Liskov Substitution Principle

- All preview components implement consistent interface
- Media items can be used interchangeably in different contexts
- RichText editor extensions follow TipTap conventions

### Interface Segregation Principle

- Component props are focused and minimal
- Backend functions accept only necessary parameters
- Type definitions are specific to their use cases

### Dependency Inversion Principle

- Components depend on abstractions (media interfaces)
- Backend functions depend on schema definitions
- UI components are decoupled from specific implementations

## Security Considerations

1. **Authentication**: All media operations require user authentication
2. **Authorization**: Users can only access their own media
3. **Validation**: Strict type validation on all inputs
4. **Rate Limiting**: Implement upload limits for media
5. **Content Security**: Validate file types and scan for malicious content

## Performance Optimizations

1. **Lazy Loading**: Load media previews only when visible
2. **Caching**: Cache generated URLs and preview data
3. **Pagination**: Implement pagination for large media collections
4. **Image Optimization**: Generate multiple sizes for responsive images
5. **CDN Integration**: Serve media through CDN for global performance

## Migration Strategy

### Existing Content Migration

```typescript
// Utility to migrate existing photo/video arrays to media references
async function migrateContentMedia(contentId: string) {
  const content = await db.get(contentId);
  if (!content) return;

  // Convert photo/video URLs to media items
  const mediaIds = await Promise.all([
    ...content.photos.map((url) => createMediaFromUrl(url, "image")),
    ...content.videos.map((url) => createMediaFromUrl(url, "video")),
  ]);

  // Update content with media references
  await db.patch(contentId, { mediaIds });
}
```

## Testing Strategy

### Unit Tests

- Schema validation
- Backend function logic
- Component rendering
- Type guards and utilities

### Integration Tests

- Media upload workflows
- RichText editor media insertion
- Item media management
- Preview component selection

### E2E Tests

- Complete user workflows
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

## Future Enhancements

1. **Advanced Media Editor**: Crop, resize, filter capabilities
2. **Bulk Operations**: Upload multiple files at once
3. **Media Categories**: Tag and categorize media items
4. **AI Integration**: Auto-tagging, content analysis
5. **Collaboration**: Shared media libraries between users
6. **Advanced Embeds**: Support for more platforms (Twitter, TikTok, etc.)

## Conclusion

This design provides a robust, type-safe, and extensible foundation for integrating media into items while maintaining clean architecture principles. The phased approach ensures incremental delivery with minimal disruption to existing functionality.
