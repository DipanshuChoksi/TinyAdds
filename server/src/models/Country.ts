import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const countrySchema = new Schema(
  {
    id: {
      type: Number,
      required: [true, "Country numeric ID is required"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Country name is required"],
      trim: true,
      maxlength: [100, "Country name cannot exceed 100 characters"],
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
countrySchema.index({ isDisplay: 1, isActive: 1 });
countrySchema.index({ isDisplay: 1, name: 1 });
countrySchema.index({ isDisplay: 1, id: 1 });

export type CountrySchemaType = InferSchemaType<typeof countrySchema>;
export type CountryDocument = HydratedDocument<CountrySchemaType>;

export const Country = model("Country", countrySchema);
