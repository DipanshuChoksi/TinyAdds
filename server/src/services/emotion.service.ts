import { Emotion, type EmotionDocument } from "../models/Emotion.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateEmotionInput, UpdateEmotionInput } from "../validators/emotion.validator.js";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class EmotionService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicEmotions(pagination: PaginationParams): Promise<PaginationResult<EmotionDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const [items, total] = await Promise.all([
      Emotion.find(filter)
        .select("name image createdAt updatedAt")
        .sort({ name: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Emotion.countDocuments(filter),
    ]);

    return {
      items: items as unknown as EmotionDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Public get by ID: must filter by isDisplay: true AND isActive: true
   */
  async getPublicEmotionById(id: string): Promise<EmotionDocument> {
    const emotion = await Emotion.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("name image createdAt updatedAt")
      .lean();

    if (!emotion) {
      throw new NotFoundError(`Emotion with id '${id}' not found`);
    }

    return emotion as unknown as EmotionDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminEmotions(pagination: PaginationParams): Promise<PaginationResult<EmotionDocument>> {
    const filter = { isDisplay: true };

    const [items, total] = await Promise.all([
      Emotion.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Emotion.countDocuments(filter),
    ]);

    return {
      items: items as unknown as EmotionDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Admin get by ID: filters by isDisplay: true
   */
  async getEmotionById(id: string): Promise<EmotionDocument> {
    const emotion = await Emotion.findOne({ _id: id, isDisplay: true }).lean();

    if (!emotion) {
      throw new NotFoundError(`Emotion with id '${id}' not found`);
    }

    return emotion as unknown as EmotionDocument;
  }

  /**
   * Create new emotion
   */
  async createEmotion(data: CreateEmotionInput): Promise<EmotionDocument> {
    const existing = await Emotion.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      isDisplay: true,
    });
    if (existing) {
      throw new ConflictError(`Emotion with name '${data.name}' already exists`);
    }

    const emotion = await Emotion.create({
      name: data.name,
      image: data.image ?? "",
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return emotion;
  }

  /**
   * Update existing emotion
   */
  async updateEmotion(id: string, data: UpdateEmotionInput): Promise<EmotionDocument> {
    if (data.name) {
      const conflict = await Emotion.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
        _id: { $ne: id },
        isDisplay: true,
      });
      if (conflict) {
        throw new ConflictError(`Emotion with name '${data.name}' already exists`);
      }
    }

    const emotion = await Emotion.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!emotion) {
      throw new NotFoundError(`Emotion with id '${id}' not found`);
    }

    return emotion;
  }

  /**
   * Soft delete emotion (set isDisplay: false and record deletedAt)
   */
  async softDeleteEmotion(id: string): Promise<void> {
    const emotion = await Emotion.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!emotion) {
      throw new NotFoundError(`Emotion with id '${id}' not found`);
    }
  }

  /**
   * Restore soft-deleted emotion (set isDisplay: true and clear deletedAt)
   */
  // async restoreEmotion(id: string): Promise<EmotionDocument> {
  //   const emotion = await Emotion.findOneAndUpdate(
  //     { _id: id, isDisplay: false },
  //     { $set: { isDisplay: true, deletedAt: null } },
  //     { new: true }
  //   );

  //   if (!emotion) {
  //     throw new NotFoundError(`Soft-deleted emotion with id '${id}' not found`);
  //   }

  //   return emotion;
  // }
}

export const emotionService = new EmotionService();
