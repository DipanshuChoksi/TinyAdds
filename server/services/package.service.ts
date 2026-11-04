import { Package, type PackageDocument } from "../models/Package.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreatePackageInput, UpdatePackageInput } from "../validators/package.validator.js";

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

export class PackageService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicPackages(pagination?: PaginationParams): Promise<PaginationResult<PackageDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 50;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      Package.find(filter)
        .sort({ price: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Package.countDocuments(filter),
    ]);

    return {
      items: items as unknown as PackageDocument[],
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
  async getPublicPackageById(id: string): Promise<PackageDocument> {
    const pkg = await Package.findOne({ _id: id, isDisplay: true, isActive: true }).lean();

    if (!pkg) {
      throw new NotFoundError(`Package with id '${id}' not found`);
    }

    return pkg as unknown as PackageDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminPackages(pagination?: PaginationParams): Promise<PaginationResult<PackageDocument>> {
    const filter = { isDisplay: true };

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 50;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      Package.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Package.countDocuments(filter),
    ]);

    return {
      items: items as unknown as PackageDocument[],
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
  async getPackageById(id: string): Promise<PackageDocument> {
    const pkg = await Package.findOne({ _id: id, isDisplay: true }).lean();

    if (!pkg) {
      throw new NotFoundError(`Package with id '${id}' not found`);
    }

    return pkg as unknown as PackageDocument;
  }

  /**
   * Create new package
   */
  async createPackage(data: CreatePackageInput): Promise<PackageDocument> {
    const existing = await Package.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      isDisplay: true,
    });
    if (existing) {
      throw new ConflictError(`Package with name '${data.name}' already exists`);
    }

    const pkg = await Package.create({
      name: data.name,
      price: data.price,
      period: data.period ?? "month",
      listingLimit: data.listingLimit,
      features: data.features ?? [],
      isPopular: data.isPopular ?? false,
      isActive: data.isActive ?? true,
      isDisplay: true,
      deletedAt: null,
    });

    return pkg;
  }

  /**
   * Update existing package
   */
  async updatePackage(id: string, data: UpdatePackageInput): Promise<PackageDocument> {
    if (data.name) {
      const conflict = await Package.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
        _id: { $ne: id },
        isDisplay: true,
      });
      if (conflict) {
        throw new ConflictError(`Package with name '${data.name}' already exists`);
      }
    }

    const pkg = await Package.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!pkg) {
      throw new NotFoundError(`Package with id '${id}' not found`);
    }

    return pkg;
  }

  /**
   * Soft delete package (set isDisplay: false and record deletedAt)
   */
  async softDeletePackage(id: string): Promise<void> {
    const pkg = await Package.findOneAndUpdate(
      { _id: id, isDisplay: true },
      { $set: { isDisplay: false, deletedAt: new Date() } }
    );

    if (!pkg) {
      throw new NotFoundError(`Package with id '${id}' not found`);
    }
  }
}

export const packageService = new PackageService();
