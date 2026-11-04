import { Schema, model, type HydratedDocument, Types } from "mongoose";

const clientPostSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactPerson: { type: String, required: true, trim: true, maxlength: 160 },
    contactNo: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    address: { type: String, default: "", trim: true, maxlength: 500 },
    banner: { type: String, default: "", trim: true, maxlength: 100 },
    emotion: { type: String, default: "", trim: true, maxlength: 100 },
    searchGroup: { type: String, default: "", trim: true, maxlength: 100 },
    searchCategory: { type: String, default: "", trim: true, maxlength: 100 },
    fromDate: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    image: { type: String, default: "", maxlength: 8_000_000 },
    tag: { type: String, default: "", trim: true, maxlength: 300 },
    description: { type: String, default: "", maxlength: 100_000 },
    isDisplay: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

clientPostSchema.index({ owner: 1, isDisplay: 1, createdAt: -1 });

export interface ClientPostData {
  owner: Types.ObjectId;
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  banner: string;
  emotion: string;
  searchGroup: string;
  searchCategory: string;
  fromDate: string;
  title: string;
  image: string;
  tag: string;
  description: string;
  isDisplay: boolean;
  deletedAt: Date | null;
}

export type ClientPostDocument = HydratedDocument<ClientPostData>;
export const ClientPost = model("ClientPost", clientPostSchema);
