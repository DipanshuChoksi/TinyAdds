import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First name is required"], trim: true, maxlength: [80, "First name cannot exceed 80 characters"] },
    lastName: { type: String, required: [true, "Last name is required"], trim: true, maxlength: [80, "Last name cannot exceed 80 characters"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true, maxlength: [254, "Email cannot exceed 254 characters"] },
    mobile: { type: String, required: [true, "Mobile number is required"], trim: true, maxlength: [20, "Mobile number cannot exceed 20 characters"] },
    passwordHash: { type: String, required: true, select: false },
    country: { type: String, default: "", trim: true, maxlength: [80, "Country cannot exceed 80 characters"] },
    state: { type: String, default: "", trim: true, maxlength: [80, "State cannot exceed 80 characters"] },
    city: { type: String, default: "", trim: true, maxlength: [80, "City cannot exceed 80 characters"] },
    profileImage: { type: String, default: "", maxlength: 8_000_000 },
    resetOtpHash: { type: String, default: "", select: false },
    resetOtpExpiresAt: { type: Date, default: null, select: false },
    resetOtpVerifiedUntil: { type: Date, default: null, select: false },
    resetOtpSentAt: { type: Date, default: null, select: false },
    resetOtpAttempts: { type: Number, default: 0, select: false },

    // Soft Delete & Visibility fields
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
  { timestamps: true }
);

// Compound indexes
userSchema.index({ isDisplay: 1, isActive: 1 });
userSchema.index({ isDisplay: 1, email: 1 });
userSchema.index({ isDisplay: 1, firstName: 1, lastName: 1 });

export type UserSchemaType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchemaType>;

export const User = model("User", userSchema);
