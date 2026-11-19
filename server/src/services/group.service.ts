import { Group, type GroupDocument } from "../models/Group.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateGroupInput, UpdateGroupInput } from "../validators/group.validator.js";

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

export class GroupService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicGroups(pagination?: PaginationParams): Promise<PaginationResult<GroupDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      Group.find(filter)
        .select("name slug image createdAt updatedAt")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Group.countDocuments(filter),
    ]);

    return {
      items: items as unknown as GroupDocument[],
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
  async getPublicGroupById(id: string): Promise<GroupDocument> {
    const group = await Group.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("name slug image createdAt updatedAt")
      .lean();

    if (!group) {
      throw new NotFoundError(`Group with id '${id}' not found`);
    }

    return group as unknown as GroupDocument;
  }

  /**
   * Public get by slug: must filter by isDisplay: true AND isActive: true
   */
  async getPublicGroupBySlug(slug: string): Promise<GroupDocument> {
    const group = await Group.findOne({
      slug: slug.toLowerCase().trim(),
      isDisplay: true,
      isActive: true,
    })
      .select("name slug image createdAt updatedAt")
      .lean();

    if (!group) {
      throw new NotFoundError(`Group with slug '${slug}' not found`);
    }

    return group as unknown as GroupDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminGroups(pagination?: PaginationParams): Promise<PaginationResult<GroupDocument>> {
    const filter = { isDisplay: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      Group.find(filter)
        .select("name slug image isActive isDisplay deletedAt createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Group.countDocuments(filter),
    ]);

    return {
      items: items as unknown as GroupDocument[],
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
  async getGroupById(id: string): Promise<GroupDocument> {
    const group = await Group.findOne({ _id: id, isDisplay: true })
      .select("name slug image isActive isDisplay deletedAt createdAt updatedAt")
      .lean();

    if (!group) {
      throw new NotFoundError(`Group with id '${id}' not found`);
    }

    return group as unknown as GroupDocument;
  }

  /**
   * Admin get by slug: filters by isDisplay: true
   */
  async getGroupBySlug(slug: string): Promise<GroupDocument> {
    const group = await Group.findOne({
      slug: slug.toLowerCase().trim(),
      isDisplay: true,
    })
      .select("name slug image isActive isDisplay deletedAt createdAt updatedAt")
      .lean();

    if (!group) {
      throw new NotFoundError(`Group with slug '${slug}' not found`);
    }

    return group as unknown as GroupDocument;
  }

  /**
   * Create new group
   */
  async createGroup(data: CreateGroupInput): Promise<GroupDocument> {
    const slug = data.slug || "";
    const orConditions: Record<string, unknown>[] = [
      { name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") } },
    ];
    if (slug) {
      orConditions.push({ slug: { $regex: new RegExp(`^${slug}$`, "i") } });
    }

    const existing = await Group.findOne({
      $or: orConditions,
      isDisplay: true,
    });
    if (existing) {
      if (existing.slug && existing.slug.toLowerCase() === slug.toLowerCase()) {
        throw new ConflictError(`Group with slug '${slug}' already exists`);
      }
      throw new ConflictError(`Group with name '${data.name}' already exists`);
    }

    const group = await Group.create({
      name: data.name,
      slug: data.slug,
      image: data.image ?? "",
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return group;
  }

  /**
   * Update existing group
   */
  async updateGroup(id: string, data: UpdateGroupInput): Promise<GroupDocument> {
    if (data.name || data.slug) {
      const orConditions: Record<string, unknown>[] = [];
      if (data.name) {
        orConditions.push({ name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") } });
      }
      if (data.slug) {
        orConditions.push({ slug: { $regex: new RegExp(`^${data.slug.trim()}$`, "i") } });
      }

      const conflict = await Group.findOne({
        _id: { $ne: id },
        $or: orConditions,
        isDisplay: true,
      });

      if (conflict) {
        if (data.slug && conflict.slug.toLowerCase() === data.slug.toLowerCase()) {
          throw new ConflictError(`Group with slug '${data.slug}' already exists`);
        }
        throw new ConflictError(`Group with name '${data.name}' already exists`);
      }
    }

    const group = await Group.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { ...data, ...(data.image !== undefined ? { image: data.image } : {}) } },
      { new: true, runValidators: true }
    );

    if (!group) {
      throw new NotFoundError(`Group with id '${id}' not found`);
    }

    return group;
  }

  /**
   * Soft delete group (set isDisplay: false and record deletedAt)
   */
  async softDeleteGroup(id: string): Promise<void> {
    const group = await Group.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!group) {
      throw new NotFoundError(`Group with id '${id}' not found`);
    }
  }
}

export const groupService = new GroupService();
