import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [10, "Phone cannot exceed 10 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
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

// Compound indexes according to project guidelines
contactSchema.index({ isDisplay: 1, isActive: 1 });
contactSchema.index({ isDisplay: 1, status: 1 });
contactSchema.index({ isDisplay: 1, createdAt: -1 });

export type ContactSchemaType = InferSchemaType<typeof contactSchema>;
export type ContactDocument = HydratedDocument<ContactSchemaType>;

export const Contact = model("Contact", contactSchema);
