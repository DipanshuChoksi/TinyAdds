import { Cms, type CmsDocument } from "../models/Cms.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateCmsInput, UpdateCmsInput } from "../validators/cms.validator.js";

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

export class CmsService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicCms(pagination: PaginationParams): Promise<PaginationResult<CmsDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const [items, total] = await Promise.all([
      Cms.find(filter)
        .select("title slug content image createdAt updatedAt")
        .sort({ title: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Cms.countDocuments(filter),
    ]);

    return {
      items: items as unknown as CmsDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Public get by ID or slug: must filter by isDisplay: true AND isActive: true
   */
  async getPublicCmsById(id: string): Promise<CmsDocument> {
    const cms = await Cms.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("title slug content image createdAt updatedAt")
      .lean();

    if (!cms) {
      throw new NotFoundError(`CMS page with id '${id}' not found`);
    }

    return cms as unknown as CmsDocument;
  }

  /**
   * Public get by slug
   */
  async getPublicCmsBySlug(slug: string): Promise<CmsDocument> {
    const cms = await Cms.findOne({ slug, isDisplay: true, isActive: true })
      .select("title slug content image createdAt updatedAt")
      .lean();

    if (!cms) {
      throw new NotFoundError(`CMS page with slug '${slug}' not found`);
    }

    return cms as unknown as CmsDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminCms(pagination: PaginationParams): Promise<PaginationResult<CmsDocument>> {
    const filter = { isDisplay: true };

    const [items, total] = await Promise.all([
      Cms.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Cms.countDocuments(filter),
    ]);

    return {
      items: items as unknown as CmsDocument[],
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
  async getCmsById(id: string): Promise<CmsDocument> {
    const cms = await Cms.findOne({ _id: id, isDisplay: true }).lean();

    if (!cms) {
      throw new NotFoundError(`CMS page with id '${id}' not found`);
    }

    return cms as unknown as CmsDocument;
  }

  /**
   * Create new CMS page
   */
  async createCms(data: CreateCmsInput): Promise<CmsDocument> {
    const slug = data.slug || "";
    const existing = await Cms.findOne({
      $or: [
        { title: { $regex: new RegExp(`^${data.title.trim()}$`, "i") } },
        { slug: { $regex: new RegExp(`^${slug}$`, "i") } },
      ],
      isDisplay: true,
    });

    if (existing) {
      if (existing.slug.toLowerCase() === slug.toLowerCase()) {
        throw new ConflictError(`CMS page with slug '${slug}' already exists`);
      }
      throw new ConflictError(`CMS page with title '${data.title}' already exists`);
    }

    const cms = await Cms.create({
      title: data.title,
      slug: data.slug,
      content: data.content ?? "",
      image: data.image ?? "",
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return cms;
  }

  /**
   * Update existing CMS page
   */
  async updateCms(id: string, data: UpdateCmsInput): Promise<CmsDocument> {
    if (data.title || data.slug) {
      const orConditions: Record<string, unknown>[] = [];
      if (data.title) {
        orConditions.push({ title: { $regex: new RegExp(`^${data.title.trim()}$`, "i") } });
      }
      if (data.slug) {
        orConditions.push({ slug: { $regex: new RegExp(`^${data.slug.trim()}$`, "i") } });
      }

      const conflict = await Cms.findOne({
        $or: orConditions,
        _id: { $ne: id },
        isDisplay: true,
      });

      if (conflict) {
        if (data.slug && conflict.slug.toLowerCase() === data.slug.toLowerCase()) {
          throw new ConflictError(`CMS page with slug '${data.slug}' already exists`);
        }
        throw new ConflictError(`CMS page with title '${data.title}' already exists`);
      }
    }

    const cms = await Cms.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!cms) {
      throw new NotFoundError(`CMS page with id '${id}' not found`);
    }

    return cms;
  }

  /**
   * Soft delete CMS page (set isDisplay: false and record deletedAt)
   */
  async softDeleteCms(id: string): Promise<void> {
    const cms = await Cms.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!cms) {
      throw new NotFoundError(`CMS page with id '${id}' not found`);
    }
  }
}

export const cmsService = new CmsService();
