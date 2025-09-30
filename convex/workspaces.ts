import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("workspaces")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to add a workspace.");
    }
    return await ctx.db.insert("workspaces", {
      userId: userId,
      name: args.name,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to remove a workspace.");
    }
    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    if (workspace.userId !== userId) {
      throw new Error("You are not authorized to delete this workspace");
    }

    // Find and delete all notes within the workspace
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.id))
      .collect();

    const deletePromises = notes.map(async (note) => {
      if (note.storageId) {
        await ctx.storage.delete(note.storageId);
      }
      await ctx.db.delete(note._id);
    });

    await Promise.all(deletePromises);

    // Delete the workspace itself
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to update a workspace.");
    }
    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      throw new Error("Workspace not found");
    }
    if (workspace.userId !== userId) {
      throw new Error("You are not authorized to update this workspace");
    }
    await ctx.db.patch(args.id, { name: args.name });
  },
});