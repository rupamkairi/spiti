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
    return { item, content };
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
      updatedAt: new Date().toISOString(),
    });
    return { item, content };
  },
});
