import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const bannerSectionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Banner section name is required"],
      trim: true,
      maxlength: [100, "Banner section name cannot exceed 100 characters"],
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
bannerSectionSchema.index({ isDisplay: 1, isActive: 1 });
bannerSectionSchema.index({ isDisplay: 1, name: 1 });

export type BannerSectionSchemaType = InferSchemaType<typeof bannerSectionSchema>;
export type BannerSectionDocument = HydratedDocument<BannerSectionSchemaType>;

export const BannerSection = model("BannerSection", bannerSectionSchema);
