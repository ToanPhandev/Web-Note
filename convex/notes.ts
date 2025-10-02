import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getFileUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    text: v.string(),
    storageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a note.");
    }
    await ctx.db.insert("notes", {
      userId,
      workspaceId: args.workspaceId,
      text: args.text,
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to delete a note.");
    }
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found.");
    }
    if (note.userId !== userId) {
      throw new Error("You are not authorized to delete this note.");
    }

    if (note.storageId) {
      await ctx.storage.delete(note.storageId);
    }

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    text: v.string(),
    storageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to update a note.");
    }
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found.");
    }
    if (note.userId !== userId) {
      throw new Error("You are not authorized to update this note.");
    }

    if (note.storageId && note.storageId !== args.storageId) {
        await ctx.storage.delete(note.storageId);
    }

    await ctx.db.patch(args.id, {
      text: args.text,
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
    });
  },
});


