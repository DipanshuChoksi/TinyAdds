import { State, type StateDocument } from "../models/State.js";
import { Country } from "../models/Country.js";
import { getNextSequence } from "../models/Counter.js";
import { NotFoundError, ConflictError, BadRequestError } from "../utils/errors.js";
import type { CreateStateInput, UpdateStateInput } from "../validators/state.validator.js";
import type { PaginationParams, PaginationResult } from "./country.service.js";

export class StateService {
  /**
   * Public list: filter by isDisplay: true AND isActive: true, optionally filtered by countryId
   */
  async getPublicStates(
    pagination: PaginationParams,
    countryId?: number
  ): Promise<PaginationResult<StateDocument>> {
    const filter: Record<string, unknown> = { isDisplay: true, isActive: true };
    if (countryId !== undefined) {
      filter.countryId = countryId;
    }

    const [items, total] = await Promise.all([
      State.find(filter)
        .select("id name countryId createdAt updatedAt")
        .sort({ name: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      State.countDocuments(filter),
    ]);

    return {
      items: items as unknown as StateDocument[],
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
  async getPublicStateById(id: number): Promise<StateDocument> {
    const state = await State.findOne({ id, isDisplay: true, isActive: true })
      .select("id name countryId createdAt updatedAt")
      .lean();

    if (!state) {
      throw new NotFoundError(`State with id '${id}' not found`);
    }

    return state as unknown as StateDocument;
  }

  /**
   * Admin list: filters by isDisplay: true (shows active & inactive, optional countryId)
   */
  async getAdminStates(
    pagination: PaginationParams,
    countryId?: number
  ): Promise<PaginationResult<StateDocument>> {
    const filter: Record<string, unknown> = { isDisplay: true };
    if (countryId !== undefined) {
      filter.countryId = countryId;
    }

    const [items, total] = await Promise.all([
      State.find(filter)
        .sort({ id: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      State.countDocuments(filter),
    ]);

    return {
      items: items as unknown as StateDocument[],
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
  async getStateById(id: number): Promise<StateDocument> {
    const state = await State.findOne({ id, isDisplay: true }).lean();

    if (!state) {
      throw new NotFoundError(`State with id '${id}' not found`);
    }

    return state as unknown as StateDocument;
  }

  /**
   * Admin create state with auto-incremented numeric id
   */
  async createState(data: CreateStateInput): Promise<StateDocument> {
    // Verify parent country exists
    const country = await Country.findOne({ id: data.countryId, isDisplay: true });
    if (!country) {
      throw new BadRequestError(`Country with id '${data.countryId}' does not exist`);
    }

    const existing = await State.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      countryId: data.countryId,
      isDisplay: true,
    });

    if (existing) {
      throw new ConflictError(`State with name '${data.name}' already exists in this country`);
    }

    const nextId = await getNextSequence("stateId");

    const state = await State.create({
      id: nextId,
      name: data.name,
      countryId: data.countryId,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isDisplay: true,
      deletedAt: null,
    });

    return state;
  }

  /**
   * Admin update state
   */
  async updateState(id: number, data: UpdateStateInput): Promise<StateDocument> {
    const currentState = await State.findOne({ id, isDisplay: true });
    if (!currentState) {
      throw new NotFoundError(`State with id '${id}' not found`);
    }

    const targetCountryId = data.countryId !== undefined ? data.countryId : currentState.countryId;

    if (data.countryId !== undefined && data.countryId !== currentState.countryId) {
      const country = await Country.findOne({ id: data.countryId, isDisplay: true });
      if (!country) {
        throw new BadRequestError(`Country with id '${data.countryId}' does not exist`);
      }
    }

    if (data.name || data.countryId !== undefined) {
      const nameToCheck = data.name ? data.name.trim() : currentState.name;
      const existing = await State.findOne({
        name: { $regex: new RegExp(`^${nameToCheck}$`, "i") },
        countryId: targetCountryId,
        id: { $ne: id },
        isDisplay: true,
      });

      if (existing) {
        throw new ConflictError(`State with name '${nameToCheck}' already exists in this country`);
      }
    }

    const state = await State.findOneAndUpdate(
      { id, isDisplay: true },
      { ...data },
      { new: true, runValidators: true }
    );

    return state!;
  }

  /**
   * Admin soft delete state
   */
  async softDeleteState(id: number): Promise<void> {
    const state = await State.findOneAndUpdate(
      { id, isDisplay: true },
      { isDisplay: false, deletedAt: new Date() },
      { new: true }
    );

    if (!state) {
      throw new NotFoundError(`State with id '${id}' not found`);
    }
  }
}

export const stateService = new StateService();
