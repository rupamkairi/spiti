# Media Gallery Implementation Task List

## Backend (Convex)

- [x] **Schema Update**: Update `convex/schema.ts` to include a `media` table for storing file metadata.
  - Fields: `storageId` (id("\_storage")), `type` (string), `name` (string), `userId` (id("users")), `createdAt` (string).
- [x] **Media Functions**: Create `convex/functions/media.ts`.
  - `generateUploadUrl`: Mutation to generate short-lived upload URL.
  - `saveMedia`: Mutation to save file metadata after upload.
  - `listMedia`: Query to fetch all media items for the user.
  - `deleteMedia`: Mutation to delete media.

## Frontend (React/Vite)

- [x] **Components**:
  - `src/components/media/MediaUpload.tsx`: Component to handle file selection and upload process.
  - `src/components/media/MediaList.tsx`: Component to display grid/list of uploaded media.
- [x] **Routes**:
  - `src/routes/media-gallery/index.tsx`: New route for the Media Gallery page.
  - Add link to Media Gallery in the main navigation (if applicable) or ensure it's accessible.

## Enhanced Media Support (Current Task)

- [x] **Schema Update**: Modify `convex/schema.ts` to support external links.
  - Make `storageId` optional.
  - Add `url` (optional string).
- [x] **Backend Update**: Update `convex/functions/media.ts`.
  - Update `saveMedia` to accept `url` and optional `storageId`.
  - Update `listMedia` to handle items without `storageId` (use `url` directly).
  - Update `deleteMedia` to handle items without `storageId` (skip storage delete).
- [x] **Frontend Components**:
  - `src/components/media/previews/FilePreview.tsx`: Handle Image, Video, Audio.
  - `src/components/media/previews/EmbedPreview.tsx`: Handle YouTube, Instagram embeds.
  - `src/components/media/LinkUpload.tsx`: Component to input URL and select type.
  - `src/components/media/MediaManager.tsx`: Tabbed interface for File Upload vs Link Upload (optional, or just place side-by-side).
- [x] **Refactor**: Update `MediaList.tsx` to use the new preview components.

## Plan

1.  **Backend**: Define schema and implement basic upload/list logic. (Completed)
2.  **Frontend**: Build the upload component and integrate with backend. (Completed)
3.  **Frontend**: Build the gallery view to display images. (Completed)
4.  **Refinement**: Ensure type safety and error handling. (Completed)
5.  **Enhancement**: Implement External Links and Previews. (Completed)
