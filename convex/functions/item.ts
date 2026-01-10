import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listItems = query({
  args: {
    folderId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("parentId"), args.folderId))
      .take(10);
    return items;
  },
});

export const createItem = mutation({
  args: {
    name: v.string(),
    parentId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const content = await ctx.db.insert("content", {
      text: "",
      content: "",
      photos: [],
      videos: [],
      mediaIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const item = await ctx.db.insert("items", {
      name: args.name,
      userId,
      contentId: content,
      parentId: args.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return item;
  },
});

export const getItem = query({
  args: {
    itemId: v.id("items"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    const content = await ctx.db.get(item.contentId);

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

export const getItemMedia = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    // Verify item ownership
    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

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

    return mediaItems.filter(Boolean);
  },
});

export const detachMediaFromItem = mutation({
  args: { itemId: v.id("items"), mediaId: v.id("media") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    // Verify item ownership
    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

    // Verify media ownership
    const media = await ctx.db.get(args.mediaId);
    if (!media || media.userId !== userId) {
      throw new Error("Media not found or unauthorized");
    }

    // Find and delete the association
    const association = await ctx.db
      .query("item_media")
      .filter((q) =>
        q.and(
          q.eq(q.field("itemId"), args.itemId),
          q.eq(q.field("mediaId"), args.mediaId),
        ),
      )
      .first();

    if (!association) {
      throw new Error("Media not attached to this item");
    }

    await ctx.db.delete(association._id);
  },
});

export const attachMediaToItem = mutation({
  args: {
    itemId: v.id("items"),
    mediaId: v.id("media"),
    position: v.optional(v.number()),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    // Verify item ownership
    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Item not found or unauthorized");
    }

    // Verify media ownership
    const media = await ctx.db.get(args.mediaId);
    if (!media || media.userId !== userId) {
      throw new Error("Media not found or unauthorized");
    }

    // Check if association already exists
    const existing = await ctx.db
      .query("item_media")
      .filter((q) =>
        q.and(
          q.eq(q.field("itemId"), args.itemId),
          q.eq(q.field("mediaId"), args.mediaId),
        ),
      )
      .first();

    if (existing) {
      throw new Error("Media already attached to this item");
    }

    // Create the association
    await ctx.db.insert("item_media", {
      itemId: args.itemId,
      mediaId: args.mediaId,
      position: args.position,
      caption: args.caption,
      createdAt: new Date().toISOString(),
    });
  },
});

export const editItem = mutation({
  args: {
    item: v.object({
      itemId: v.id("items"),
      contentId: v.union(v.id("content")),
      name: v.string(),
      parentId: v.union(v.id("folders"), v.null()),
      content: v.object({
        text: v.string(),
        content: v.string(),
        photos: v.array(v.string()),
        videos: v.array(v.string()),
        mediaIds: v.array(v.id("media")),
        updatedAt: v.union(v.string(), v.null()),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const item = await ctx.db.get(args.item.itemId);
    if (!item) {
      throw new Error("Item not found");
    }
    const content = await ctx.db.get(args.item.contentId);
    if (!content) {
      throw new Error("Content not found");
    }
    await ctx.db.patch(args.item.itemId, {
      name: args.item.name,
      parentId: args.item.parentId,
      updatedAt: new Date().toISOString(),
    });
    await ctx.db.patch(args.item.contentId, {
      text: args.item.content.text,
      content: args.item.content.content,
      photos: args.item.content.photos,
      videos: args.item.content.videos,
      mediaIds: args.item.content.mediaIds,
      updatedAt: new Date().toISOString(),
    });
    return { item, content };
  },
});
