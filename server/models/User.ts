import { Schema, model, type HydratedDocument } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    mobile: { type: String, required: true, trim: true, maxlength: 20 },
    passwordHash: { type: String, required: true, select: false },
    country: { type: String, default: "", trim: true, maxlength: 80 },
    state: { type: String, default: "", trim: true, maxlength: 80 },
    city: { type: String, default: "", trim: true, maxlength: 80 },
    profileImage: { type: String, default: "", maxlength: 8_000_000 },
    resetOtpHash: { type: String, default: "", select: false },
    resetOtpExpiresAt: { type: Date, default: null, select: false },
    resetOtpVerifiedUntil: { type: Date, default: null, select: false },
    resetOtpSentAt: { type: Date, default: null, select: false },
    resetOtpAttempts: { type: Number, default: 0, select: false },
  },
  { timestamps: true }
);

export type UserDocument = HydratedDocument<{
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  passwordHash: string;
  country: string;
  state: string;
  city: string;
  profileImage: string;
  resetOtpHash: string;
  resetOtpExpiresAt: Date | null;
  resetOtpVerifiedUntil: Date | null;
  resetOtpSentAt: Date | null;
  resetOtpAttempts: number;
}>;

export const User = model("User", userSchema);
