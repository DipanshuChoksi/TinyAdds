import { SearchCategory, type SearchCategoryDocument } from "../models/SearchCategory.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateSearchCategoryInput, UpdateSearchCategoryInput } from "../validators/searchCategory.validator.js";

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

export class SearchCategoryService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicSearchCategories(pagination?: PaginationParams): Promise<PaginationResult<SearchCategoryDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      SearchCategory.find(filter)
        .select("name createdAt updatedAt")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SearchCategory.countDocuments(filter),
    ]);

    return {
      items: items as unknown as SearchCategoryDocument[],
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
  async getPublicSearchCategoryById(id: string): Promise<SearchCategoryDocument> {
    const category = await SearchCategory.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("name createdAt updatedAt")
      .lean();

    if (!category) {
      throw new NotFoundError(`Search Category with id '${id}' not found`);
    }

    return category as unknown as SearchCategoryDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminSearchCategories(pagination?: PaginationParams): Promise<PaginationResult<SearchCategoryDocument>> {
    const filter = { isDisplay: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      SearchCategory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SearchCategory.countDocuments(filter),
    ]);

    return {
      items: items as unknown as SearchCategoryDocument[],
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
  async getSearchCategoryById(id: string): Promise<SearchCategoryDocument> {
    const category = await SearchCategory.findOne({ _id: id, isDisplay: true }).lean();

    if (!category) {
      throw new NotFoundError(`Search Category with id '${id}' not found`);
    }

    return category as unknown as SearchCategoryDocument;
  }

  /**
   * Create new search category
   */
  async createSearchCategory(data: CreateSearchCategoryInput): Promise<SearchCategoryDocument> {
    const existing = await SearchCategory.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      isDisplay: true,
    });
    if (existing) {
      throw new ConflictError(`Search Category with name '${data.name}' already exists`);
    }

    const category = await SearchCategory.create({
      name: data.name,
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return category;
  }

  /**
   * Update existing search category
   */
  async updateSearchCategory(id: string, data: UpdateSearchCategoryInput): Promise<SearchCategoryDocument> {
    if (data.name) {
      const conflict = await SearchCategory.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
        _id: { $ne: id },
        isDisplay: true,
      });
      if (conflict) {
        throw new ConflictError(`Search Category with name '${data.name}' already exists`);
      }
    }

    const category = await SearchCategory.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new NotFoundError(`Search Category with id '${id}' not found`);
    }

    return category;
  }

  /**
   * Soft delete search category (set isDisplay: false and record deletedAt)
   */
  async softDeleteSearchCategory(id: string): Promise<void> {
    const category = await SearchCategory.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!category) {
      throw new NotFoundError(`Search Category with id '${id}' not found`);
    }
  }
}

export const searchCategoryService = new SearchCategoryService();
