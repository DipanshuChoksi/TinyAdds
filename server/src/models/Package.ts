import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const packageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
      maxlength: [100, "Package name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Package price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    period: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },
    listingLimit: {
      type: Number,
      required: [true, "Listing limit is required"],
      min: [1, "Listing limit must be at least 1"],
      default: 10,
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
      type: Boolean,
      default: false,
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
packageSchema.index({ isDisplay: 1, isActive: 1 });
packageSchema.index({ isDisplay: 1, name: 1 });
packageSchema.index({ isDisplay: 1, isPopular: 1 });

export type PackageSchemaType = InferSchemaType<typeof packageSchema>;
export type PackageDocument = HydratedDocument<PackageSchemaType>;

export const Package = model("Package", packageSchema);
