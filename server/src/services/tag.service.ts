import { Tag, type TagDocument } from "../models/Tag.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateTagInput, UpdateTagInput } from "../validators/tag.validator.js";

export class TagService {
  /**
   * Public list: filter by isDisplay: true AND isActive: true (unpaginated)
   */
  async getPublicTags(): Promise<TagDocument[]> {
    const filter = { isDisplay: true, isActive: true };

    const items = await Tag.find(filter)
      .select("name createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    return items as unknown as TagDocument[];
  }

  /**
   * Public get by ID: filter by isDisplay: true AND isActive: true
   */
  async getPublicTagById(id: string): Promise<TagDocument> {
    const tag = await Tag.findOne({ _id: id, isDisplay: true, isActive: true })
      .select("name createdAt updatedAt")
      .lean();

    if (!tag) {
      throw new NotFoundError(`Tag with id '${id}' not found`);
    }

    return tag as unknown as TagDocument;
  }

  /**
   * Admin list: filter by isDisplay: true (shows active & inactive, unpaginated)
   */
  async getAdminTags(): Promise<TagDocument[]> {
    const filter = { isDisplay: true };

    const items = await Tag.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return items as unknown as TagDocument[];
  }

  /**
   * Admin get by ID: filter by isDisplay: true
   */
  async getTagById(id: string): Promise<TagDocument> {
    const tag = await Tag.findOne({ _id: id, isDisplay: true }).lean();

    if (!tag) {
      throw new NotFoundError(`Tag with id '${id}' not found`);
    }

    return tag as unknown as TagDocument;
  }

  /**
   * Admin create tag
   */
  async createTag(input: CreateTagInput): Promise<TagDocument> {
    const existing = await Tag.findOne({
      name: { $regex: new RegExp(`^${input.name.trim()}$`, "i") },
      isDisplay: true,
    });

    if (existing) {
      throw new ConflictError(`Tag with name '${input.name}' already exists`);
    }

    const tag = await Tag.create({
      name: input.name,
      isActive: input.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return tag;
  }

  /**
   * Admin update tag
   */
  async updateTag(id: string, input: UpdateTagInput): Promise<TagDocument> {
    const tag = await Tag.findOne({ _id: id, isDisplay: true });

    if (!tag) {
      throw new NotFoundError(`Tag with id '${id}' not found`);
    }

    if (input.name && input.name.toLowerCase() !== tag.name.toLowerCase()) {
      const existing = await Tag.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${input.name.trim()}$`, "i") },
        isDisplay: true,
      });

      if (existing) {
        throw new ConflictError(`Tag with name '${input.name}' already exists`);
      }
    }

    if (input.name !== undefined) tag.name = input.name;
    if (input.isActive !== undefined) tag.isActive = input.isActive;

    await tag.save();
    return tag;
  }

  /**
   * Admin soft delete tag: set isDisplay: false, deletedAt: now
   */
  async softDeleteTag(id: string): Promise<TagDocument> {
    const tag = await Tag.findOne({ _id: id, isDisplay: true });

    if (!tag) {
      throw new NotFoundError(`Tag with id '${id}' not found`);
    }

    tag.isDisplay = false;
    tag.deletedAt = new Date();
    await tag.save();

    return tag;
  }

  /**
   * Admin restore tag: set isDisplay: true, deletedAt: null
   */
  async restoreTag(id: string): Promise<TagDocument> {
    const tag = await Tag.findOne({ _id: id, isDisplay: false });

    if (!tag) {
      throw new NotFoundError(`Soft-deleted tag with id '${id}' not found`);
    }

    const collision = await Tag.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${tag.name.trim()}$`, "i") },
      isDisplay: true,
    });

    if (collision) {
      throw new ConflictError(
        `Cannot restore tag: an active tag with name '${tag.name}' already exists`
      );
    }

    tag.isDisplay = true;
    tag.deletedAt = null;
    await tag.save();

    return tag;
  }
}

export const tagService = new TagService();
