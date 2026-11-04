import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { User } from "../models/User.js";
import { AppError, ConflictError, NotFoundError } from "../utils/errors.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { sendPasswordOtp } from "../utils/email.js";
import { config } from "../config/index.js";
import type { ProfileUpdateInput, RegisterUserInput } from "../validators/user.validator.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_DELAY_MS = 30 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function otpHash(otp: string): string {
  return createHash("sha256").update(`${config.sessionSecret}:${otp}`).digest("hex");
}

function publicUser(user: {
  _id: unknown;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  profileImage: string;
}) {
  return {
    id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    country: user.country,
    state: user.state,
    city: user.city,
    profileImage: user.profileImage,
  };
}

export class UserService {
  async register(input: RegisterUserInput) {
    const existing = await User.exists({ email: input.email });
    if (existing) throw new ConflictError("An account with this email already exists");
    const user = await User.create({ ...input, passwordHash: await hashPassword(input.password) });
    return publicUser(user);
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new AppError("Email or password is incorrect", 401, "INVALID_CREDENTIALS");
    }
    return publicUser(user);
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("Account not found");
    return publicUser(user);
  }

  async updateProfile(userId: string, input: ProfileUpdateInput) {
    const duplicate = await User.exists({ email: input.email, _id: { $ne: userId } });
    if (duplicate) throw new ConflictError("An account with this email already exists");
    const user = await User.findByIdAndUpdate(userId, { $set: input }, { new: true, runValidators: true });
    if (!user) throw new NotFoundError("Account not found");
    return publicUser(user);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpiresAt +resetOtpSentAt");
    if (!user) return;
    if (user.resetOtpSentAt && Date.now() - user.resetOtpSentAt.getTime() < OTP_RESEND_DELAY_MS) {
      throw new AppError("Please wait before requesting another code", 429, "OTP_RATE_LIMITED");
    }
    const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
    user.resetOtpHash = otpHash(otp);
    user.resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    user.resetOtpVerifiedUntil = null;
    user.resetOtpSentAt = new Date();
    user.resetOtpAttempts = 0;
    await user.save();
    await sendPasswordOtp(user.email, otp);
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<void> {
    const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpiresAt +resetOtpVerifiedUntil +resetOtpAttempts");
    const storedHash = user?.resetOtpHash ?? "";
    const providedHash = otpHash(otp);
    const stored = Buffer.from(storedHash);
    const provided = Buffer.from(providedHash);
    const validHash = stored.length === provided.length && timingSafeEqual(stored, provided);
    if (!user || !validHash || !user.resetOtpExpiresAt || user.resetOtpExpiresAt.getTime() <= Date.now() || user.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
      if (user) {
        user.resetOtpAttempts += 1;
        await user.save();
      }
      throw new AppError("The verification code is invalid or expired", 400, "INVALID_OTP");
    }
    user.resetOtpVerifiedUntil = new Date(Date.now() + OTP_TTL_MS);
    user.resetOtpHash = "";
    await user.save();
  }

  async resetPassword(email: string, password: string): Promise<void> {
    const user = await User.findOne({ email }).select("+resetOtpVerifiedUntil");
    if (!user?.resetOtpVerifiedUntil || user.resetOtpVerifiedUntil.getTime() <= Date.now()) {
      throw new AppError("Verify the email code before resetting your password", 400, "OTP_NOT_VERIFIED");
    }
    user.passwordHash = await hashPassword(password);
    user.resetOtpHash = "";
    user.resetOtpExpiresAt = null;
    user.resetOtpVerifiedUntil = null;
    user.resetOtpSentAt = null;
    user.resetOtpAttempts = 0;
    await user.save();
  }

  /**
   * Admin: List users with pagination and search
   */
  async getAdminUsers(pagination: { page: number; limit: number; skip: number }, search?: string) {
    const filter: Record<string, unknown> = { isDisplay: true };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { mobile: regex },
        { city: regex },
        { state: regex },
        { country: regex },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter)
        .select("-passwordHash -resetOtpHash -resetOtpExpiresAt -resetOtpVerifiedUntil -resetOtpSentAt -resetOtpAttempts")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Admin: Get user by ID
   */
  async getUserById(id: string) {
    const user = await User.findOne({ _id: id, isDisplay: true })
      .select("-passwordHash -resetOtpHash -resetOtpExpiresAt -resetOtpVerifiedUntil -resetOtpSentAt -resetOtpAttempts")
      .lean();

    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    return user;
  }

  /**
   * Admin: Soft delete user
   */
  async softDeleteUser(id: string): Promise<void> {
    const user = await User.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }
  }
}

export const userService = new UserService();
