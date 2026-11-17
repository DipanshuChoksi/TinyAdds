import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    bannerImage: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDisplay: {
      type: Boolean,
      default: true,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal queries according to AGENTS.md rules
blogSchema.index({ isDisplay: 1, isActive: 1 });
blogSchema.index({ isDisplay: 1, title: 1 });

export type BlogSchemaType = InferSchemaType<typeof blogSchema>;
export type BlogDocument = HydratedDocument<BlogSchemaType>;

export const Blog = model("Blog", blogSchema);
