import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const stateSchema = new Schema(
  {
    id: {
      type: Number,
      required: [true, "State numeric ID is required"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "State name is required"],
      trim: true,
      maxlength: [100, "State name cannot exceed 100 characters"],
    },
    countryId: {
      type: Number,
      required: [true, "Country ID is required"],
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
stateSchema.index({ isDisplay: 1, isActive: 1 });
stateSchema.index({ isDisplay: 1, countryId: 1, name: 1 });
stateSchema.index({ isDisplay: 1, id: 1 });

export type StateSchemaType = InferSchemaType<typeof stateSchema>;
export type StateDocument = HydratedDocument<StateSchemaType>;

export const State = model("State", stateSchema);
