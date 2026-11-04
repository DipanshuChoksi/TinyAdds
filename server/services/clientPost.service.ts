import { Types } from "mongoose";
import { ClientPost, type ClientPostData } from "../models/ClientPost.js";
import { NotFoundError } from "../utils/errors.js";
import type { ClientPostInput } from "../validators/post.validator.js";

type PostRecord = Pick<ClientPostData, "contactPerson" | "contactNo" | "email" | "address" | "banner" | "emotion" | "searchGroup" | "searchCategory" | "fromDate" | "title" | "image" | "tag" | "description"> & {
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
  };
}

export class ClientPostService {
  async list(ownerId: string, page: number, limit: number) {
    const filter = { owner: new Types.ObjectId(ownerId), isDisplay: true };
    const [items, total] = await Promise.all([
      ClientPost.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ClientPost.countDocuments(filter),
    ]);
    return {
      items: items.map(serializePost),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async get(ownerId: string, postId: string) {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOne({ _id: postId, owner: ownerId, isDisplay: true }).lean();
    if (!post) throw new NotFoundError("Post not found");
    return serializePost(post);
  }

  async create(ownerId: string, input: ClientPostInput) {
    const post = await ClientPost.create({ ...input, owner: new Types.ObjectId(ownerId) });
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

  async softDelete(ownerId: string, postId: string): Promise<void> {
    if (!Types.ObjectId.isValid(postId)) throw new NotFoundError("Post not found");
    const post = await ClientPost.findOneAndUpdate(
      { _id: postId, owner: ownerId, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );
    if (!post) throw new NotFoundError("Post not found");
  }
}

export const clientPostService = new ClientPostService();
