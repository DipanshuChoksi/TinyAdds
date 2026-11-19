import { BannerSection, type BannerSectionDocument } from "../models/BannerSection.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateBannerSectionInput, UpdateBannerSectionInput } from "../validators/bannerSection.validator.js";

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

export class BannerSectionService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicBannerSections(pagination?: PaginationParams): Promise<PaginationResult<BannerSectionDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      BannerSection.find(filter)
        .select("name slug createdAt updatedAt")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BannerSection.countDocuments(filter),
    ]);

    return {
      items: items as unknown as BannerSectionDocument[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Public get by ID: must filter by isDisplay: true AND isActive: true
   */
  async getPublicBannerSectionById(id: string): Promise<BannerSectionDocument> {
    const banner = await BannerSection.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("name slug createdAt updatedAt")
      .lean();

    if (!banner) {
      throw new NotFoundError(`Banner section with id '${id}' not found`);
    }

    return banner as unknown as BannerSectionDocument;
  }

  /**
   * Public get by slug: must filter by isDisplay: true AND isActive: true
   */
  async getPublicBannerSectionBySlug(slug: string): Promise<BannerSectionDocument> {
    const banner = await BannerSection.findOne({
      slug: slug.toLowerCase().trim(),
      isDisplay: true,
      isActive: true,
    })
      .select("name slug createdAt updatedAt")
      .lean();

    if (!banner) {
      throw new NotFoundError(`Banner section with slug '${slug}' not found`);
    }

    return banner as unknown as BannerSectionDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminBannerSections(pagination?: PaginationParams): Promise<PaginationResult<BannerSectionDocument>> {
    const filter = { isDisplay: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      BannerSection.find(filter)
        .select("name slug isActive isDisplay deletedAt createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BannerSection.countDocuments(filter),
    ]);

    return {
      items: items as unknown as BannerSectionDocument[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Admin get by ID: filters by isDisplay: true
   */
  async getBannerSectionById(id: string): Promise<BannerSectionDocument> {
    const banner = await BannerSection.findOne({ _id: id, isDisplay: true })
      .select("name slug isActive isDisplay deletedAt createdAt updatedAt")
      .lean();

    if (!banner) {
      throw new NotFoundError(`Banner section with id '${id}' not found`);
    }

    return banner as unknown as BannerSectionDocument;
  }

  /**
   * Admin get by slug: filters by isDisplay: true
   */
  async getBannerSectionBySlug(slug: string): Promise<BannerSectionDocument> {
    const banner = await BannerSection.findOne({
      slug: slug.toLowerCase().trim(),
      isDisplay: true,
    })
      .select("name slug isActive isDisplay deletedAt createdAt updatedAt")
      .lean();

    if (!banner) {
      throw new NotFoundError(`Banner section with slug '${slug}' not found`);
    }

    return banner as unknown as BannerSectionDocument;
  }

  /**
   * Create new banner section
   */
  async createBannerSection(data: CreateBannerSectionInput): Promise<BannerSectionDocument> {
    const slug = data.slug || "";
    const orConditions: Record<string, unknown>[] = [
      { name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") } },
    ];
    if (slug) {
      orConditions.push({ slug: { $regex: new RegExp(`^${slug}$`, "i") } });
    }

    const existing = await BannerSection.findOne({
      $or: orConditions,
      isDisplay: true,
    });
    if (existing) {
      if (existing.slug && existing.slug.toLowerCase() === slug.toLowerCase()) {
        throw new ConflictError(`Banner section with slug '${slug}' already exists`);
      }
      throw new ConflictError(`Banner section with name '${data.name}' already exists`);
    }

    const banner = await BannerSection.create({
      name: data.name,
      slug: data.slug,
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return banner;
  }

  /**
   * Update existing banner section
   */
  async updateBannerSection(id: string, data: UpdateBannerSectionInput): Promise<BannerSectionDocument> {
    if (data.name || data.slug) {
      const orConditions: Record<string, unknown>[] = [];
      if (data.name) {
        orConditions.push({ name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") } });
      }
      if (data.slug) {
        orConditions.push({ slug: { $regex: new RegExp(`^${data.slug.trim()}$`, "i") } });
      }

      const conflict = await BannerSection.findOne({
        _id: { $ne: id },
        $or: orConditions,
        isDisplay: true,
      });

      if (conflict) {
        if (data.slug && conflict.slug.toLowerCase() === data.slug.toLowerCase()) {
          throw new ConflictError(`Banner section with slug '${data.slug}' already exists`);
        }
        throw new ConflictError(`Banner section with name '${data.name}' already exists`);
      }
    }

    const banner = await BannerSection.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!banner) {
      throw new NotFoundError(`Banner section with id '${id}' not found`);
    }

    return banner;
  }

  /**
   * Soft delete banner section (set isDisplay: false and record deletedAt)
   */
  async softDeleteBannerSection(id: string): Promise<void> {
    const banner = await BannerSection.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!banner) {
      throw new NotFoundError(`Banner section with id '${id}' not found`);
    }
  }
}

export const bannerSectionService = new BannerSectionService();
