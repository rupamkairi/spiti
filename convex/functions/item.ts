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
    const item = await ctx.db.insert("items", {
      name: args.name,
      userId,
      parentId: args.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return item;
  },
});
