import { Country, type CountryDocument } from "../models/Country.js";
import { getNextSequence } from "../models/Counter.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import type { CreateCountryInput, UpdateCountryInput } from "../validators/country.validator.js";

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

export class CountryService {
  /**
   * Public list: must filter by isDisplay: true AND isActive: true
   */
  async getPublicCountries(pagination: PaginationParams): Promise<PaginationResult<CountryDocument>> {
    const filter = { isDisplay: true, isActive: true };

    const [items, total] = await Promise.all([
      Country.find(filter)
        .select("id name createdAt updatedAt")
        .sort({ name: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Country.countDocuments(filter),
    ]);

    return {
      items: items as unknown as CountryDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Public get by numeric ID: must filter by isDisplay: true AND isActive: true
   */
  async getPublicCountryById(id: number): Promise<CountryDocument> {
    const country = await Country.findOne({ id, isDisplay: true, isActive: true })
      .select("id name createdAt updatedAt")
      .lean();

    if (!country) {
      throw new NotFoundError(`Country with id '${id}' not found`);
    }

    return country as unknown as CountryDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive)
   */
  async getAdminCountries(pagination: PaginationParams): Promise<PaginationResult<CountryDocument>> {
    const filter = { isDisplay: true };

    const [items, total] = await Promise.all([
      Country.find(filter)
        .sort({ id: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      Country.countDocuments(filter),
    ]);

    return {
      items: items as unknown as CountryDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Admin get by numeric ID
   */
  async getCountryById(id: number): Promise<CountryDocument> {
    const country = await Country.findOne({ id, isDisplay: true }).lean();

    if (!country) {
      throw new NotFoundError(`Country with id '${id}' not found`);
    }

    return country as unknown as CountryDocument;
  }

  /**
   * Admin create country with auto-incremented numeric id
   */
  async createCountry(data: CreateCountryInput): Promise<CountryDocument> {
    const existing = await Country.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      isDisplay: true,
    });

    if (existing) {
      throw new ConflictError(`Country with name '${data.name}' already exists`);
    }

    const nextId = await getNextSequence("countryId");

    const country = await Country.create({
      id: nextId,
      name: data.name,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isDisplay: true,
      deletedAt: null,
    });

    return country;
  }

  /**
   * Admin update country
   */
  async updateCountry(id: number, data: UpdateCountryInput): Promise<CountryDocument> {
    if (data.name) {
      const existing = await Country.findOne({
        name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
        id: { $ne: id },
        isDisplay: true,
      });

      if (existing) {
        throw new ConflictError(`Country with name '${data.name}' already exists`);
      }
    }

    const country = await Country.findOneAndUpdate(
      { id, isDisplay: true },
      { ...data },
      { new: true, runValidators: true }
    );

    if (!country) {
      throw new NotFoundError(`Country with id '${id}' not found`);
    }

    return country;
  }

  /**
   * Admin soft delete country
   */
  async softDeleteCountry(id: number): Promise<void> {
    const country = await Country.findOneAndUpdate(
      { id, isDisplay: true },
      { isDisplay: false, deletedAt: new Date() },
      { new: true }
    );

    if (!country) {
      throw new NotFoundError(`Country with id '${id}' not found`);
    }
  }
}

export const countryService = new CountryService();
