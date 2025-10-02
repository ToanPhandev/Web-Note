import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Function to generate a URL-friendly slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

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

    let path = slugify(args.name);
    let existing = await ctx.db
      .query("workspaces")
      .withIndex("by_path", (q) => q.eq("path", path))
      .first();

    // If path exists, append a random suffix
    if (existing) {
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      path = `${path}-${randomSuffix}`;
    }

    return await ctx.db.insert("workspaces", {
      userId: userId,
      name: args.name,
      path: path,
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
      return;
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

export const migrateWorkspaces = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }

    const userWorkspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const workspace of userWorkspaces) {
      if (!workspace.path) {
        let path = slugify(workspace.name);
        let existing = await ctx.db
          .query("workspaces")
          .withIndex("by_path", (q) => q.eq("path", path))
          .first();

        if (existing) {
          const randomSuffix = Math.random().toString(36).substring(2, 7);
          path = `${path}-${randomSuffix}`;
        }
        await ctx.db.patch(workspace._id, { path: path });
      }
    }
  },
});
