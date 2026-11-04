import { City, type CityDocument } from "../models/City.js";
import { State } from "../models/State.js";
import { Country } from "../models/Country.js";
import { getNextSequence } from "../models/Counter.js";
import { NotFoundError, ConflictError, BadRequestError } from "../utils/errors.js";
import type { CreateCityInput, UpdateCityInput } from "../validators/city.validator.js";
import type { PaginationParams, PaginationResult } from "./country.service.js";

export class CityService {
  /**
   * Public list: filter by isDisplay: true AND isActive: true, optional countryId and stateId
   */
  async getPublicCities(
    pagination: PaginationParams,
    countryId?: number,
    stateId?: number
  ): Promise<PaginationResult<CityDocument>> {
    const filter: Record<string, unknown> = { isDisplay: true, isActive: true };
    if (countryId !== undefined) {
      filter.countryId = countryId;
    }
    if (stateId !== undefined) {
      filter.stateId = stateId;
    }

    const [items, total] = await Promise.all([
      City.find(filter)
        .select("id name countryId stateId createdAt updatedAt")
        .sort({ name: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      City.countDocuments(filter),
    ]);

    return {
      items: items as unknown as CityDocument[],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 1,
      },
    };
  }

  /**
   * Public get by numeric ID
   */
  async getPublicCityById(id: number): Promise<CityDocument> {
    const city = await City.findOne({ id, isDisplay: true, isActive: true })
      .select("id name countryId stateId createdAt updatedAt")
      .lean();

    if (!city) {
      throw new NotFoundError(`City with id '${id}' not found`);
    }

    return city as unknown as CityDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive, optional filters)
   */
  async getAdminCities(
    pagination: PaginationParams,
    countryId?: number,
    stateId?: number
  ): Promise<PaginationResult<CityDocument>> {
    const filter: Record<string, unknown> = { isDisplay: true };
    if (countryId !== undefined) {
      filter.countryId = countryId;
    }
    if (stateId !== undefined) {
      filter.stateId = stateId;
    }

    const [items, total] = await Promise.all([
      City.find(filter)
        .sort({ id: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      City.countDocuments(filter),
    ]);

    return {
      items: items as unknown as CityDocument[],
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
  async getCityById(id: number): Promise<CityDocument> {
    const city = await City.findOne({ id, isDisplay: true }).lean();

    if (!city) {
      throw new NotFoundError(`City with id '${id}' not found`);
    }

    return city as unknown as CityDocument;
  }

  /**
   * Admin create city with auto-incremented numeric id
   */
  async createCity(data: CreateCityInput): Promise<CityDocument> {
    // Validate parent country exists
    const country = await Country.findOne({ id: data.countryId, isDisplay: true });
    if (!country) {
      throw new BadRequestError(`Country with id '${data.countryId}' does not exist`);
    }

    // Validate parent state exists and belongs to the country
    const state = await State.findOne({ id: data.stateId, countryId: data.countryId, isDisplay: true });
    if (!state) {
      throw new BadRequestError(`State with id '${data.stateId}' does not exist or does not belong to country '${data.countryId}'`);
    }

    const existing = await City.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      stateId: data.stateId,
      isDisplay: true,
    });

    if (existing) {
      throw new ConflictError(`City with name '${data.name}' already exists in this state`);
    }

    const nextId = await getNextSequence("cityId");

    const city = await City.create({
      id: nextId,
      name: data.name,
      countryId: data.countryId,
      stateId: data.stateId,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isDisplay: true,
      deletedAt: null,
    });

    return city;
  }

  /**
   * Admin update city
   */
  async updateCity(id: number, data: UpdateCityInput): Promise<CityDocument> {
    const currentCity = await City.findOne({ id, isDisplay: true });
    if (!currentCity) {
      throw new NotFoundError(`City with id '${id}' not found`);
    }

    const targetCountryId = data.countryId !== undefined ? data.countryId : currentCity.countryId;
    const targetStateId = data.stateId !== undefined ? data.stateId : currentCity.stateId;

    if (data.countryId !== undefined || data.stateId !== undefined) {
      const state = await State.findOne({ id: targetStateId, countryId: targetCountryId, isDisplay: true });
      if (!state) {
        throw new BadRequestError(`State with id '${targetStateId}' does not exist or does not belong to country '${targetCountryId}'`);
      }
    }

    if (data.name || data.stateId !== undefined) {
      const nameToCheck = data.name ? data.name.trim() : currentCity.name;
      const existing = await City.findOne({
        name: { $regex: new RegExp(`^${nameToCheck}$`, "i") },
        stateId: targetStateId,
        id: { $ne: id },
        isDisplay: true,
      });

      if (existing) {
        throw new ConflictError(`City with name '${nameToCheck}' already exists in this state`);
      }
    }

    const city = await City.findOneAndUpdate(
      { id, isDisplay: true },
      { ...data },
      { new: true, runValidators: true }
    );

    return city!;
  }

  /**
   * Admin soft delete city
   */
  async softDeleteCity(id: number): Promise<void> {
    const city = await City.findOneAndUpdate(
      { id, isDisplay: true },
      { isDisplay: false, deletedAt: new Date() },
      { new: true }
    );

    if (!city) {
      throw new NotFoundError(`City with id '${id}' not found`);
    }
  }
}

export const cityService = new CityService();
