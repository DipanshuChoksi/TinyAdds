import { Types } from "mongoose";
import { ClientPost, type ClientPostData } from "../models/ClientPost.js";
import { User } from "../models/User.js";
import { City } from "../models/City.js";
import { Group } from "../models/Group.js";
import { BannerSection } from "../models/BannerSection.js";
import { Emotion } from "../models/Emotion.js";
import { Tag } from "../models/Tag.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import type { ClientPostInput } from "../validators/post.validator.js";
import type { PostListQuery } from "../validators/postQuery.validator.js";

type PostRecord = {
  _id: Types.ObjectId | string;
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  cityId?: number | null | undefined;
  cityName?: string | undefined;
  banner?: Types.ObjectId | string | null | undefined;
  emotion?: Types.ObjectId | string | null | undefined;
  searchGroup?: Types.ObjectId | string | null | undefined;
  searchCategory?: Types.ObjectId | string | null | undefined;
  fromDate: string;
  expiresAt?: Date | null | undefined;
  title: string;
  image: string;
  tags?: (Types.ObjectId | string | { _id: Types.ObjectId | string; name: string })[] | undefined;
  description: string;
  createdAt: Date;
  status?: "pending" | "approved" | "rejected" | undefined;
  rejectionComment?: string | undefined;
  reviewedByName?: string | undefined;
  reviewedAt?: Date | null | undefined;
};

function serializePost(post: PostRecord) {
  const tags = (Array.isArray(post.tags) ? post.tags : []).filter(
    (t): t is NonNullable<typeof t> => t !== null && t !== undefined
  );

  return {
    id: String(post._id),
    contactPerson: post.contactPerson,
    contactNo: post.contactNo,
    email: post.email,
    address: post.address,
    cityId: post.cityId ?? null,
    cityName: post.cityName ?? "",
    banner: post.banner,
    emotion: post.emotion,
    searchGroup: post.searchGroup,
    searchCategory: post.searchCategory ? String(post.searchCategory) : "",
    fromDate: post.fromDate,
    expiresAt: post.expiresAt ?? null,
    title: post.title,
    image: post.image,
    tags,
    description: post.description,
    createdAt: post.createdAt,
    status: post.status ?? "pending",
    rejectionComment: post.rejectionComment ?? "",
    reviewedByName: post.reviewedByName ?? "",
    reviewedAt: post.reviewedAt ?? null,
  };
}

function buildListFilter(ownerId: string | null, search: string): Record<string, unknown> {
  const filter: Record<string, unknown> = { isDisplay: true };
  if (ownerId) filter.owner = new Types.ObjectId(ownerId);
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { contactPerson: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
      { rejectionComment: { $regex: escapedSearch, $options: "i" } },
    ];
  }
  return filter;
}

function buildSort(query: PostListQuery): Record<string, 1 | -1> {
  const sort: Record<string, 1 | -1> = { [query.sortBy]: query.sortDirection === "asc" ? 1 : -1 };
  if (query.sortBy !== "createdAt") sort.createdAt = -1;
  return sort;
}

function calculateDefaultExpiresAt(fromDateStr: string): Date {
  const d = new Date(fromDateStr);
  d.setDate(d.getDate() + 30);
  return d;
}

export class ClientPostService {
  async list(ownerId: string, query: PostListQuery) {
    const filter = buildListFilter(ownerId, query.search);
    const [items, total] = await Promise.all([
      ClientPost.find(filter)
        .populate({
          path: "tags",
          select: "name _id",
          match: { isDisplay: true, isActive: true },
        })
        .sort(buildSort(query))
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean(),
      ClientPost.countDocuments(filter),
    ]);
    return {
      items: items.map(serializePost),
      meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) || 1 },
    };
  }

  async listForAdmin(query: PostListQuery) {
    const filter = buildListFilter(null, query.search);
    const [items, total] = await Promise.all([
      ClientPost.find(filter)
        .populate({
          path: "tags",
          select: "name _id",
          match: { isDisplay: true, isActive: true },
        })
        .sort(buildSort(query))
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean(),
      ClientPost.countDocuments(filter),
    ]);
    return {
      items: items.map(serializePost),
      meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) || 1 },
    };
  }

  async get(ownerId: string, postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOne({ _id: postId, owner: ownerId, isDisplay: true })
      .populate({
        path: "tags",
        select: "name _id",
        match: { isDisplay: true, isActive: true },
      })
      .lean();
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async getForAdmin(postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOne({ _id: postId, isDisplay: true })
      .populate({
        path: "tags",
        select: "name _id",
        match: { isDisplay: true, isActive: true },
      })
      .lean();
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async getPublicPostById(postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const now = new Date();
    const post = await ClientPost.findOne({
      _id: postId,
      isDisplay: true,
      status: "approved",
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    })
      .populate("banner", "name")
      .populate("emotion", "name")
      .populate("searchGroup", "name")
      .populate({
        path: "tags",
        select: "name _id",
        match: { isDisplay: true, isActive: true },
      })
      .lean();
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async create(ownerId: string, input: ClientPostInput) {
    const expiresAt = calculateDefaultExpiresAt(input.fromDate);
    const post = await ClientPost.create({ ...input, expiresAt, owner: new Types.ObjectId(ownerId) });
    return serializePost(post);
  }

  async createForAdmin(input: ClientPostInput) {
    const expiresAt = input.expiresAt ?? calculateDefaultExpiresAt(input.fromDate);
    const post = await ClientPost.create({ ...input, expiresAt, owner: null });
    return serializePost(post);
  }

  async update(ownerId: string, postId: string, input: ClientPostInput) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const existing = await ClientPost.findOne({ _id: postId, owner: ownerId, isDisplay: true });
    if (!existing) throw new NotFoundError("Post not found");
    if (existing.status === "approved") {
      throw new BadRequestError("Approved posts cannot be updated");
    }

    const post = await ClientPost.findByIdAndUpdate(
      postId,
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async updateForAdmin(postId: string, input: ClientPostInput) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOneAndUpdate(
      { _id: postId, isDisplay: true },
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async updateStatus(
    postId: string,
    adminId: string | null,
    status: ClientPostData["status"],
    rejectionComment = "",
    localAdminName = "Admin"
  ) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const comment = rejectionComment.trim();
    if (status === "rejected" && !comment) throw new BadRequestError("A rejection comment is required");
    let reviewedByName = localAdminName;
    if (adminId) {
      const admin = await User.findById(adminId).select("firstName lastName").lean();
      if (!admin) throw new NotFoundError("Admin account not found");
      reviewedByName = `${admin.firstName} ${admin.lastName}`.trim();
    }
    const post = await ClientPost.findOneAndUpdate(
      { _id: postId, isDisplay: true },
      {
        $set: {
          status,
          rejectionComment: status === "rejected" ? comment : "",
          reviewedBy: adminId ? new Types.ObjectId(adminId) : null,
          reviewedByName,
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async softDelete(ownerId: string, postId: string): Promise<void> {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const actor = await User.findById(ownerId).select("firstName lastName").lean();
    if (!actor) throw new NotFoundError("Account not found");
    const deletedAt = new Date();
    const deletedByName = `${actor.firstName} ${actor.lastName}`.trim();
    const post = await ClientPost.findOneAndUpdate(
      { _id: postId, owner: ownerId, isDisplay: true },
      {
        $set: {
          isDisplay: false,
          deletedAt,
          deletedBy: new Types.ObjectId(ownerId),
          deletedByName,
        },
      }
    );
    if (!post) throw new NotFoundError("Post not found");
  }

  /**
   * Public list of approved posts.
   * If banner is specified, filters by banner section name.
   * Only posts whose fromDate is <= today (or specified date) are active.
   */
  async getPublicPosts(query: {
    banner?: string | undefined;
    searchGroup?: string | undefined;
    searchCategory?: string | undefined;
    emotion?: string | undefined;
    tags?: string[] | string | undefined;
    cityId?: number | undefined;
    search?: string | undefined;
    fromDate?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 50));
    const skip = (page - 1) * limit;

    const conditions: Record<string, unknown>[] = [
      { isDisplay: true },
      { status: "approved" },
    ];

    if (query.cityId !== undefined && query.cityId !== null) {
      // Find the City document to get its ObjectId
      const cityDoc = await City.findOne({ id: query.cityId, isDisplay: true }).select("_id").lean();

      const cityConditions: Record<string, unknown>[] = [{ cityId: query.cityId }];
      if (cityDoc) {
        // Users who have this city assigned in their profile (not deleted)
        const matchingUsers = await User.find({
          city: cityDoc._id,
          isDisplay: { $ne: false },
          deletedAt: null,
        }).select("_id").lean();
        if (matchingUsers.length > 0) {
          const userIds = matchingUsers.map((u) => u._id);
          cityConditions.push({ owner: { $in: userIds } });
        }
      }

      conditions.push({ $or: cityConditions });
    }

    if (query.banner && query.banner.trim()) {
      const bannerVal = query.banner.trim();
      if (Types.ObjectId.isValid(bannerVal)) {
        conditions.push({ banner: new Types.ObjectId(bannerVal) });
      } else {
        const bannerDoc = await BannerSection.findOne({
          slug: bannerVal.toLowerCase(),
          isDisplay: true,
        }).select("_id").lean();
        if (bannerDoc) {
          conditions.push({ banner: bannerDoc._id });
        } else {
          // If slug does not match any banner section, return empty results
          conditions.push({ banner: new Types.ObjectId() });
        }
      }
    }

    if (query.searchGroup && query.searchGroup.trim()) {
      const groupVal = query.searchGroup.trim();
      if (Types.ObjectId.isValid(groupVal)) {
        conditions.push({ searchGroup: new Types.ObjectId(groupVal) });
      } else {
        const groupDoc = await Group.findOne({
          slug: groupVal.toLowerCase(),
          isDisplay: true,
        }).select("_id").lean();
        if (groupDoc) {
          conditions.push({ searchGroup: groupDoc._id });
        } else {
          conditions.push({ searchGroup: new Types.ObjectId() });
        }
      }
    }

    if (query.searchCategory && query.searchCategory.trim()) {
      conditions.push({ searchCategory: query.searchCategory.trim() });
    }

    if (query.emotion && query.emotion.trim()) {
      const emotionVal = query.emotion.trim();
      if (Types.ObjectId.isValid(emotionVal)) {
        conditions.push({ emotion: new Types.ObjectId(emotionVal) });
      } else {
        const emotionDoc = await Emotion.findOne({
          slug: emotionVal.toLowerCase(),
          isDisplay: true,
        }).select("_id").lean();
        if (emotionDoc) {
          conditions.push({ emotion: emotionDoc._id });
        } else {
          conditions.push({ emotion: new Types.ObjectId() });
        }
      }
    }

    if (query.tags) {
      const tagList = Array.isArray(query.tags)
        ? query.tags
        : typeof query.tags === "string"
        ? query.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const validTagIds = tagList
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      if (validTagIds.length > 0) {
        conditions.push({ tags: { $in: validTagIds } });
      }
    }

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      
      // Match by group name or tag name
      const [matchingGroups, matchingTags] = await Promise.all([
        Group.find({ name: searchRegex, isDisplay: true }).select("_id").lean(),
        Tag.find({ name: searchRegex, isDisplay: true }).select("_id").lean(),
      ]);

      const groupIds = matchingGroups.map((g) => g._id);
      const tagIds = matchingTags.map((t) => t._id);

      const orConditions: Record<string, unknown>[] = [
        { title: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { contactPerson: searchRegex },
      ];

      if (groupIds.length > 0) {
        orConditions.push({ searchGroup: { $in: groupIds } });
      }

      if (tagIds.length > 0) {
        orConditions.push({ tags: { $in: tagIds } });
      }

      conditions.push({ $or: orConditions });
    }

    // Date condition: ad starts when the date comes (fromDate <= today)
    const targetDate = query.fromDate || new Date().toISOString().slice(0, 10);
    conditions.push({ fromDate: { $lte: targetDate } });

    // Expiration condition: if expiresAt exists, it must be greater than current date
    const now = new Date();
    conditions.push({
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    });

    const filter = conditions.length > 1 ? { $and: conditions } : (conditions[0] || {});

    const [items, total] = await Promise.all([
      ClientPost.find(filter)
        .populate("banner", "name _id")
        .populate("emotion", "name _id")
        .populate("searchGroup", "name _id")
        .populate({
          path: "tags",
          select: "name _id",
          match: { isDisplay: true, isActive: true },
        })
        .sort({ fromDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ClientPost.countDocuments(filter),
    ]);

    return {
      items: items.map(serializePost),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }
}

export const clientPostService = new ClientPostService();
