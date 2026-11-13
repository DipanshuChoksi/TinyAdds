import { Blog, type BlogDocument } from "../models/Blog.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateBlogInput, UpdateBlogInput } from "../validators/blog.validator.js";

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

export class BlogService {
  /**
   * Public list: filter by isDisplay: true AND isActive: true
   */
  async getPublicBlogs(pagination: PaginationParams): Promise<PaginationResult<BlogDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .select("title content bannerImage createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return {
      items: items as unknown as BlogDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Public get by ID: filter by isDisplay: true AND isActive: true
   */
  async getPublicBlogById(id: string): Promise<BlogDocument> {
    const blog = await Blog.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("title content bannerImage createdAt updatedAt")
      .lean();

    if (!blog) {
      throw new NotFoundError(`Blog with id '${id}' not found`);
    }

    return blog as unknown as BlogDocument;
  }

  /**
   * Admin list: filter by isDisplay: true (shows active & inactive)
   */
  async getAdminBlogs(pagination: PaginationParams): Promise<PaginationResult<BlogDocument>> {
    const filter = { isDisplay: true };

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    return {
      items: items as unknown as BlogDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Admin get by ID: filter by isDisplay: true
   */
  async getBlogById(id: string): Promise<BlogDocument> {
    const blog = await Blog.findOne({ _id: id, isDisplay: true }).lean();

    if (!blog) {
      throw new NotFoundError(`Blog with id '${id}' not found`);
    }

    return blog as unknown as BlogDocument;
  }

  /**
   * Create new blog
   */
  async createBlog(data: CreateBlogInput): Promise<BlogDocument> {
    const existing = await Blog.findOne({
      title: { $regex: new RegExp(`^${data.title.trim()}$`, "i") },
      isDisplay: true,
    });
    if (existing) {
      throw new ConflictError(`Blog with title '${data.title}' already exists`);
    }

    const blog = await Blog.create({
      title: data.title,
      content: data.content ?? "",
      bannerImage: data.bannerImage ?? "",
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return blog;
  }

  /**
   * Update existing blog
   */
  async updateBlog(id: string, data: UpdateBlogInput): Promise<BlogDocument> {
    if (data.title) {
      const conflict = await Blog.findOne({
        title: { $regex: new RegExp(`^${data.title.trim()}$`, "i") },
        _id: { $ne: id },
        isDisplay: true,
      });
      if (conflict) {
        throw new ConflictError(`Blog with title '${data.title}' already exists`);
      }
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!blog) {
      throw new NotFoundError(`Blog with id '${id}' not found`);
    }

    return blog;
  }

  /**
   * Soft delete blog (set isDisplay: false and record deletedAt)
   */
  async softDeleteBlog(id: string): Promise<void> {
    const blog = await Blog.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!blog) {
      throw new NotFoundError(`Blog with id '${id}' not found`);
    }
  }
}

export const blogService = new BlogService();
