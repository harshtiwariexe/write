import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }
    if (existingDocuments.userID !== userID) {
      throw new Error("Not Authorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }
    if (existingDocuments.userID !== userID) {
      throw new Error("Not Authorized");
    }

    const recursiveRestore = async (documentID: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userID", userID).eq("parentDocument", documentID),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocuments.parentDocument) {
      const parent = await ctx.db.get(existingDocuments.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userID", userID))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }
    if (existingDocuments.userID !== userID) {
      throw new Error("Not Authorized");
    }

    const recursiveArchive = async (documentID: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userID", userID).eq("parentDocument", documentID),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userID", userID).eq("parentDocument", args.parentDocument),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

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

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userID", userID))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);

    // Check if the document exists
    if (!document) {
      throw new Error("Not Found");
    }

    // Allow access if the document is published and not archived
    if (document.isPublished && !document.isArchived) {
      return document;
    }

    // Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }

    // Check if the authenticated user is authorized to access the document
    const userID = identity.subject;
    if (document.userID !== userID) {
      throw new Error("Not Authorized");
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

    const { id, ...rest } = args;
    const existingDocuments = await ctx.db.get(id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }
    if (existingDocuments.userID !== userID) {
      throw new Error("Not Authorized");
    }

    const document = await ctx.db.patch(id, {
      ...rest,
    });

    return document;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }
    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

    if (existingDocuments?.userID !== userID) {
      throw new Error("Not Authorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });
    return document;
  },
});

export const removeImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }
    if (!identity) {
      throw new Error("Not Authenticated");
    }

    const userID = identity.subject;

    if (existingDocuments?.userID !== userID) {
      throw new Error("Not Authorized");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });
    return document;
  },
});
