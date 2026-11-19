import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
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
tagSchema.index({ isDisplay: 1, isActive: 1 });
tagSchema.index({ isDisplay: 1, name: 1 });

export type TagSchemaType = InferSchemaType<typeof tagSchema>;
export type TagDocument = HydratedDocument<TagSchemaType>;

export const Tag = model("Tag", tagSchema);
