import { Types } from "mongoose";
import { ClientPost, type ClientPostData } from "../models/ClientPost.js";
import { User } from "../models/User.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import type { ClientPostInput } from "../validators/post.validator.js";
import type { PostListQuery } from "../validators/postQuery.validator.js";

type PostRecord = Pick<ClientPostData, "contactPerson" | "contactNo" | "email" | "address" | "banner" | "emotion" | "searchGroup" | "searchCategory" | "fromDate" | "title" | "image" | "tag" | "description"> & Partial<Pick<ClientPostData, "status" | "rejectionComment" | "reviewedByName" | "reviewedAt">> & {
  _id: Types.ObjectId;
  createdAt: Date;
};

function serializePost(post: PostRecord) {
  return {
    id: String(post._id),
    contactPerson: post.contactPerson,
    contactNo: post.contactNo,
    email: post.email,
    address: post.address,
    banner: post.banner,
    emotion: post.emotion,
    searchGroup: post.searchGroup,
    searchCategory: post.searchCategory,
    fromDate: post.fromDate,
    title: post.title,
    image: post.image,
    tag: post.tag,
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

export class ClientPostService {
  async list(ownerId: string, query: PostListQuery) {
    const filter = buildListFilter(ownerId, query.search);
    const [items, total] = await Promise.all([
      ClientPost.find(filter).sort(buildSort(query)).skip((query.page - 1) * query.limit).limit(query.limit).lean(),
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
      ClientPost.find(filter).sort(buildSort(query)).skip((query.page - 1) * query.limit).limit(query.limit).lean(),
      ClientPost.countDocuments(filter),
    ]);
    return {
      items: items.map(serializePost),
      meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) || 1 },
    };
  }

  async get(ownerId: string, postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOne({ _id: postId, owner: ownerId, isDisplay: true }).lean();
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async getForAdmin(postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOne({ _id: postId, isDisplay: true }).lean();
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async create(ownerId: string, input: ClientPostInput) {
    const post = await ClientPost.create({ ...input, owner: new Types.ObjectId(ownerId) });
    return serializePost(post);
  }

  async createForAdmin(input: ClientPostInput) {
    const post = await ClientPost.create({ ...input, owner: null });
    return serializePost(post);
  }

  async update(ownerId: string, postId: string, input: ClientPostInput) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOneAndUpdate(
      { _id: postId, owner: ownerId, isDisplay: true },
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
}

export const clientPostService = new ClientPostService();
