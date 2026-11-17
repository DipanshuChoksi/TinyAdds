import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [100, "Group name cannot exceed 100 characters"],
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

// Compound indexes
groupSchema.index({ isDisplay: 1, isActive: 1 });
groupSchema.index({ isDisplay: 1, name: 1 });

export type GroupSchemaType = InferSchemaType<typeof groupSchema>;
export type GroupDocument = HydratedDocument<GroupSchemaType>;

export const Group = model("Group", groupSchema);
