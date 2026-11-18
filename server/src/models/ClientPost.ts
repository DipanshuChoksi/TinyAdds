import { Schema, model, type HydratedDocument, Types } from "mongoose";

const clientPostSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    contactPerson: { type: String, required: true, trim: true, maxlength: 160 },
    contactNo: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    address: { type: String, default: "", trim: true, maxlength: 500 },
    cityId: { type: Number, default: null, index: true },
    cityName: { type: String, default: "", trim: true, maxlength: 100 },
    banner: { type: Schema.Types.ObjectId, ref: "BannerSection", default: null, index: true },
    emotion: { type: Schema.Types.ObjectId, ref: "Emotion", default: null, index: true },
    searchGroup: { type: Schema.Types.ObjectId, ref: "Group", default: null, index: true },
    searchCategory: { type: Schema.Types.ObjectId, ref: "SearchCategory", default: null, index: true },
    fromDate: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    image: { type: String, default: "", maxlength: 8_000_000 },
    tag: { type: String, default: "", trim: true, maxlength: 300 },
    description: { type: String, default: "", maxlength: 100_000 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    rejectionComment: { type: String, default: "", trim: true, maxlength: 2000 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedByName: { type: String, default: "", trim: true, maxlength: 161 },
    reviewedAt: { type: Date, default: null },
    isDisplay: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deletedByName: { type: String, default: "", trim: true, maxlength: 161 },
  },
  { timestamps: true }
);

clientPostSchema.index({ owner: 1, isDisplay: 1, createdAt: -1 });

export interface ClientPostData {
  owner: Types.ObjectId | null;
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  cityId: number | null;
  cityName: string;
  banner: Types.ObjectId | null;
  emotion: Types.ObjectId | null;
  searchGroup: Types.ObjectId | null;
  searchCategory: Types.ObjectId | null;
  fromDate: string;
  title: string;
  image: string;
  tag: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  rejectionComment: string;
  reviewedBy: Types.ObjectId | null;
  reviewedByName: string;
  reviewedAt: Date | null;
  isDisplay: boolean;
  deletedAt: Date | null;
  deletedBy: Types.ObjectId | null;
  deletedByName: string;
}

export type ClientPostDocument = HydratedDocument<ClientPostData>;
export const ClientPost = model("ClientPost", clientPostSchema);
