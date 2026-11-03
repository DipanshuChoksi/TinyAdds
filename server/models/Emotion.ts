import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const emotionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Emotion name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
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
emotionSchema.index({ isDisplay: 1, isActive: 1 });
emotionSchema.index({ isDisplay: 1, name: 1 });

export type EmotionSchemaType = InferSchemaType<typeof emotionSchema>;
export type EmotionDocument = HydratedDocument<EmotionSchemaType>;

export const Emotion = model("Emotion", emotionSchema);
