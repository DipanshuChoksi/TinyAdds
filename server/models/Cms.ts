import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const cmsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      maxlength: [200, "Slug cannot exceed 200 characters"],
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
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
cmsSchema.index({ isDisplay: 1, isActive: 1 });
cmsSchema.index({ isDisplay: 1, slug: 1 });
cmsSchema.index({ isDisplay: 1, title: 1 });

export type CmsSchemaType = InferSchemaType<typeof cmsSchema>;
export type CmsDocument = HydratedDocument<CmsSchemaType>;

export const Cms = model("Cms", cmsSchema);
