import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  folders: defineTable({
    name: v.string(),
    userId: v.id("users"),
    parentId: v.union(v.id("folders"), v.null()),
    createdAt: v.string(),
    updatedAt: v.union(v.string(), v.null()),
  }),
  items: defineTable({
    name: v.string(),
    userId: v.id("users"),
    parentId: v.union(v.id("folders"), v.null()),
    contentId: v.id("content"),
    createdAt: v.string(),
    updatedAt: v.union(v.string(), v.null()),
  }),
  content: defineTable({
    text: v.string(),
    content: v.string(),
    photos: v.array(v.string()),
    videos: v.array(v.string()),
    createdAt: v.string(),
    updatedAt: v.union(v.string(), v.null()),
  }),
  media: defineTable({
    storageId: v.optional(v.id("_storage")),
    url: v.optional(v.string()),
    type: v.string(),
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),
});
