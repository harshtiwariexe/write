import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const identitty = await ctx.auth.getUserIdentity();

    if (!identitty) {
      throw new Error("Not Authenticated");
    }

    const documents = await ctx.db.query("documents").collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identitty = await ctx.auth.getUserIdentity();

    if (!identitty) {
      throw new Error("Not Authenticated");
    }

    const userID = identitty.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userID,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});
