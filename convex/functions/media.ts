import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMedia = mutation({
  args: {
    storageId: v.optional(v.id("_storage")),
    url: v.optional(v.string()),
    name: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    await ctx.db.insert("media", {
      storageId: args.storageId,
      url: args.url,
      name: args.name,
      type: args.type,
      userId,
      createdAt: new Date().toISOString(),
    });
  },
});

export const listMedia = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return []; // Return empty if not authenticated
    }
    const mediaItems = await ctx.db
      .query("media")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return Promise.all(
      mediaItems.map(async (media) => ({
        ...media,
        url: media.storageId ? await ctx.storage.getUrl(media.storageId) : media.url,
      }))
    );
  },
});

export const deleteMedia = mutation({
  args: {
    mediaId: v.id("media"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const media = await ctx.db.get(args.mediaId);
    if (!media || media.userId !== userId) {
      throw new Error("Media not found or unauthorized");
    }
    
    if (args.storageId) {
      await ctx.storage.delete(args.storageId);
    }
    await ctx.db.delete(args.mediaId);
  },
});
