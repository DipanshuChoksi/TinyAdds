import { BadRequestError } from "../utils/errors.js";

export type PostSortField = "title" | "fromDate" | "createdAt" | "status";
export type SortDirection = "asc" | "desc";

export interface PostListQuery {
  page: number;
  limit: number;
  search: string;
  sortBy: PostSortField;
  sortDirection: SortDirection;
}

function positiveInteger(value: unknown, fallback: number, field: string, maximum: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== "string") throw new BadRequestError(`${field} must be a positive integer`);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new BadRequestError(`${field} must be a positive integer`);
  return Math.min(parsed, maximum);
}

export function validatePostListQuery(query: unknown): PostListQuery {
  if (typeof query !== "object" || query === null || Array.isArray(query)) throw new BadRequestError("Query parameters are invalid");
  const values = query as Record<string, unknown>;
  const search = values.search ?? "";
  if (typeof search !== "string" || search.length > 120) throw new BadRequestError("Search must be a string up to 120 characters");

  const requestedSort = values.sortBy ?? "createdAt";
  if (typeof requestedSort !== "string" || !["title", "fromDate", "createdAt", "status"].includes(requestedSort)) {
    throw new BadRequestError("Sort field is invalid");
  }
  const sortDirection = values.sortDirection ?? "desc";
  if (sortDirection !== "asc" && sortDirection !== "desc") throw new BadRequestError("Sort direction is invalid");

  return {
    page: positiveInteger(values.page, 1, "Page", Number.MAX_SAFE_INTEGER),
    limit: positiveInteger(values.limit, 10, "Limit", 100),
    search: search.trim(),
    sortBy: requestedSort as PostSortField,
    sortDirection,
  };
}
