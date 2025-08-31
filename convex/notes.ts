import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("You must be logged in to create a note.");
    }
    await ctx.db.insert("notes", {
      userId,
      text: args.text,
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
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    text: v.string(),
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
    await ctx.db.patch(args.id, {
      text: args.text,
    });
  },
});
