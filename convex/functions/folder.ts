import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listFolders = query({
  args: {
    folderId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const folders = await ctx.db
      .query("folders")
      .filter((q) => q.eq(q.field("parentId"), args.folderId))
      .take(10);
    return folders;
  },
});

export const createFolder = mutation({
  args: {
    name: v.string(),
    parentId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const folder = await ctx.db.insert("folders", {
      name: args.name,
      userId,
      parentId: args.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return folder;
  },
});
//  (name: string, parentId: string | null)
