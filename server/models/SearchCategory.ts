import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const searchCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Search Category name is required"],
      trim: true,
      maxlength: [100, "Search Category name cannot exceed 100 characters"],
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
searchCategorySchema.index({ isDisplay: 1, isActive: 1 });
searchCategorySchema.index({ isDisplay: 1, name: 1 });

export type SearchCategorySchemaType = InferSchemaType<typeof searchCategorySchema>;
export type SearchCategoryDocument = HydratedDocument<SearchCategorySchemaType>;

export const SearchCategory = model("SearchCategory", searchCategorySchema);
