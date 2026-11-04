import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const citySchema = new Schema(
  {
    id: {
      type: Number,
      required: [true, "City numeric ID is required"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },
    countryId: {
      type: Number,
      required: [true, "Country ID is required"],
      index: true,
    },
    stateId: {
      type: Number,
      required: [true, "State ID is required"],
      index: true,
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
citySchema.index({ isDisplay: 1, isActive: 1 });
citySchema.index({ isDisplay: 1, stateId: 1, name: 1 });
citySchema.index({ isDisplay: 1, countryId: 1 });
citySchema.index({ isDisplay: 1, id: 1 });

export type CitySchemaType = InferSchemaType<typeof citySchema>;
export type CityDocument = HydratedDocument<CitySchemaType>;

export const City = model("City", citySchema);
