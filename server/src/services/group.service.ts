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
        .select("name createdAt updatedAt")
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
      .select("name createdAt updatedAt")
      .lean();

    if (!group) {
      throw new NotFoundError(`Group with id '${id}' not found`);
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
    const group = await Group.findOne({ _id: id, isDisplay: true }).lean();

    if (!group) {
      throw new NotFoundError(`Group with id '${id}' not found`);
    }

    return group as unknown as GroupDocument;
  }

  /**
   * Create new group
   */
  async createGroup(data: CreateGroupInput): Promise<GroupDocument> {
    const existing = await Group.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      isDisplay: true,
    });
    if (existing) {
      throw new ConflictError(`Group with name '${data.name}' already exists`);
    }

    const group = await Group.create({
      name: data.name,
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
    if (data.name) {
      const conflict = await Group.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
        _id: { $ne: id },
        isDisplay: true,
      });
      if (conflict) {
        throw new ConflictError(`Group with name '${data.name}' already exists`);
      }
    }

    const group = await Group.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
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
