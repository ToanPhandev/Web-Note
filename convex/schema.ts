import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  notes: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    text: v.string(),
    storageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"]),

  workspaces: defineTable({
    userId: v.id("users"),
    name: v.string(),
    path: v.string(),
  }).index("by_user", ["userId"])
    .index("by_path", ["path"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
