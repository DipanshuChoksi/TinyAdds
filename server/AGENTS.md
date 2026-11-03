# AGENT.md

> Engineering standards for AI agents contributing to this Node.js + Express + TypeScript + MongoDB (Mongoose) backend.
> These rules are enforceable. Follow them exactly. If something is ambiguous, inspect the codebase first — do not guess.

---

## 0. Ground Rules

- **Inspect before modifying.** Read relevant routes, controllers, services, models, middleware, validators, `tsconfig.json`, `package.json`, and database configuration.
- **Follow existing conventions.** Match naming, error handling, response shapes, and import styles.
- **Do not duplicate.** Reuse existing helpers, validators, middleware, and error classes.
- **No new dependencies** without justification and approval.
- **No unrelated modifications.**
- **Do not change API contracts** without approval.
- **Do not overengineer** or introduce unnecessary abstractions.
- Never bypass validation, authentication, authorization, or TypeScript checks.
- After changes, run type checking, linting, and relevant tests.
- Update documentation when behavior, configuration, or API contracts change.

## 1. Architecture

| Layer | Responsibility | Must NOT |
|---|---|---|
| `routes/` | Route and middleware wiring | Contain business logic |
| `controllers/` | Request/response handling | Contain business logic or DB queries |
| `services/` | Business logic and orchestration | Access `req`/`res` |
| `models/` | Mongoose schemas and database operations | Contain HTTP concerns |
| `middleware/` | Authentication, validation, errors, rate limiting | Contain business logic |
| `validators/` | Validate request body, params, and query | Contain business logic |
| `utils/` | Reusable, preferably pure helpers | Import controllers/services |

- Follow the existing feature-based folder structure.
- Controllers must never query MongoDB directly.
- Services must not depend on Express objects.
- Avoid circular dependencies.
- Keep functions small and single-responsibility.

## 2. TypeScript

- `strict: true` is mandatory. Never weaken compiler settings.
- No `any`. Use `unknown` and narrow explicitly.
- Avoid unnecessary type assertions and non-null assertions.
- Define explicit types for request inputs, service contracts, and model data.
- Use Mongoose's appropriate types, including `Types.ObjectId`, `HydratedDocument`, and model generics where needed.
- Keep domain types separate from API request/response types.
- Use `import type` for type-only imports.
- Never assume TypeScript types replace runtime validation.

## 3. Express

- Separate application initialization from server startup.
- Follow established middleware registration order.
- Use the existing async error-handling approach.
- Use centralized error middleware and existing custom error classes.
- Register 404 handling after routes and before the global error handler.
- Avoid redundant try/catch blocks in controllers.
- Never send multiple responses for one request.

## 4. API Standards

- Follow the existing response structure. If none exists, use:

```ts
// Success
{
  success: true,
  data: T,
  meta?: { page, limit, total, totalPages }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: unknown
  }
}
```

- Use appropriate HTTP status codes.
- Keep error codes stable and machine-readable.
- Validate pagination parameters.
- Bound list queries using configurable pagination limits.
- Never expose MongoDB internals or sensitive information in API responses.

## 5. MongoDB and Mongoose

- Use Mongoose for database operations. Do not introduce SQL-specific patterns.
- Define schemas and models centrally according to existing module conventions.
- Use explicit schema types, required fields, defaults, enums, and validation rules where appropriate.
- Keep business logic out of schema definitions unless it is genuinely model-level behavior.
- Use `Types.ObjectId` consistently for MongoDB references.
- Validate ObjectId values before querying documents.
- Handle missing documents and duplicate key errors explicitly.
- Use `.lean()` for read-only queries when hydrated documents are unnecessary.
- Select only required fields using projections.
- Use `.populate()` selectively; avoid unnecessary or deeply nested population.
- Prefer aggregation pipelines for complex data transformations and reporting.
- Use indexes for frequently filtered, sorted, and queried fields. Check existing indexes before creating new ones.
- Avoid unbounded queries and large document retrievals.
- Use `.limit()` and pagination for list endpoints.
- Avoid N+1 query patterns.
- Use `.bulkWrite()` for appropriate bulk operations rather than unnecessary sequential writes.
- Use MongoDB transactions with Mongoose sessions when multiple writes must be atomic. Ensure the deployment supports transactions.
- Never assume SQL-style joins, foreign keys, or migrations exist.
- For schema evolution, handle existing documents and backward compatibility explicitly.
- Avoid unnecessary schema changes that could break existing data.
- Use `.select()`, `.sort()`, `.skip()`, and `.limit()` deliberately and consistently.
- Never use unsafe dynamic query construction from untrusted request input.
- Prevent mass assignment by explicitly selecting allowed fields.
- Do not blindly spread `req.body` into Mongoose create/update operations.
- Use `runValidators: true` for update operations when appropriate.
- Handle Mongoose validation, casting, duplicate key, and connection errors consistently.

### 6. Mongoose Record Visibility and Soft Delete

Every applicable model uses two separate boolean fields:

- `isActive`: Controls whether a record is publicly active.
- `isDisplay`: Controls whether a record exists in normal application visibility (soft deletion).

#### Field Semantics

- `isActive: false`: Hide the record from public-facing APIs, but keep it visible and manageable in admin APIs.
- `isDisplay: false`: Soft-delete the record. Hide it from both public and admin APIs.
- `isActive` and `isDisplay` must never be treated as interchangeable.
- Default both fields to `true` where applicable.

#### Query Visibility Rules

- Public queries must filter by `isDisplay: true` AND `isActive: true`.
- Admin queries must filter by `isDisplay: true`, regardless of `isActive`.
- Normal queries must exclude `isDisplay: false` by default.
- Do not repeatedly add visibility conditions manually when they can be enforced through centralized query helpers or middleware.
- Aggregation pipelines, `$lookup`, `populate`, counts, and other query operations must follow the same visibility rules.
- Explicit visibility overrides must be intentional, authorized, and limited to operations that genuinely require them.

#### Soft Delete

- Soft deletion means setting `isDisplay: false`.
- Never physically delete records during normal application operations.
- Implement soft deletion through a dedicated service/helper.
- Soft-deleted records must remain excluded from both public and admin queries.
- Do not use `deleteOne`, `deleteMany`, or `findOneAndDelete` for normal application deletion.
- Permanent deletion, if required, must be a separate, explicitly authorized maintenance operation.

#### Restore

- Restore records through an explicit service operation that sets `isDisplay: true`.
- Check relevant business constraints before restoring.
- Do not automatically restore records during ordinary updates.

#### Implementation Requirements

- Keep visibility filtering centralized and consistent across all supported Mongoose query operations.
- Ensure public and admin query contexts are distinguishable.
- Never allow a public request to bypass visibility filters.
- Do not expose soft-deleted records through populate, aggregation, or indirect relationships.
- Add tests covering inactive records, soft-deleted records, public queries, admin queries, aggregation, populate, and restore behavior.

## 7. Security

- Validate every incoming body, query, and route parameter.
- Use existing authentication and authorization middleware.
- Enforce ownership and permission checks in the service layer.
- Protect against NoSQL injection; never pass untrusted objects directly into MongoDB filters.
- Whitelist allowed filter, sort, and update fields.
- Prevent mass assignment and unauthorized property updates.
- Never expose passwords, tokens, or sensitive document fields.
- Use existing password hashing utilities.
- Keep CORS and security headers centrally configured.
- Never expose stack traces or internal errors in production responses.
- Never log secrets or sensitive request data.

## 8. Code Quality

- Variables/functions: `camelCase`.
- Classes/types/interfaces: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE` where appropriate.
- Follow existing file naming conventions.
- Keep functions focused and readable.
- Avoid duplicate code and unnecessary abstractions.
- No dead code, commented-out code, or committed debugging statements.
- Follow existing ESLint and formatting rules.

## 9. Configuration

- Access environment variables through one centralized, typed configuration module.
- Validate required variables during startup.
- Never scatter `process.env` throughout application code.
- Keep `.env.example` updated.
- Never commit actual credentials or secrets.
- Fail fast when required configuration is missing or invalid.
- Centralize MongoDB connection configuration and handle connection failures properly.

## 10. Testing

- Use the existing test framework.
- Unit test important services, utilities, and validators.
- Integration test Mongoose models and database operations.
- Test API endpoints, authentication, authorization, and error cases.
- Use an isolated test database.
- Ensure test data is cleaned up.
- Keep tests deterministic.
- Do not use production databases for testing.
- All relevant tests must pass before completion.

## 11. Performance

- Paginate all potentially large list endpoints.
- Use appropriate indexes and query projections.
- Use `.lean()` for read-only operations where suitable.
- Avoid unnecessary `.populate()` calls.
- Optimize aggregation pipelines.
- Avoid N+1 database queries.
- Use caching only when justified and with a clear invalidation strategy.
- Avoid blocking synchronous operations in request handlers.
- Do not prematurely optimize without evidence.

---

## Completion Checklist

- [ ] Existing architecture and conventions inspected.
- [ ] No duplicated helpers or unnecessary dependencies.
- [ ] Layering respected.
- [ ] Strict TypeScript maintained; no unjustified `any` or assertions.
- [ ] Inputs validated and authorization enforced.
- [ ] API response contracts preserved.
- [ ] Mongoose schemas and queries follow project conventions.
- [ ] ObjectId, casting, and database errors handled correctly.
- [ ] Queries are indexed and optimized where appropriate.
- [ ] Transactions used where atomicity is required.
- [ ] Configuration centralized.
- [ ] Tests added/updated and passing.
- [ ] Type checking and linting pass.
- [ ] Documentation updated where necessary.

## Final Rule

This document is the source of truth for backend engineering conventions.

Every AI agent must follow these rules before implementing changes. When existing code conflicts with these standards, inspect the impact and propose the smallest safe correction instead of silently rewriting the architecture.

**Priority: Consistency → Correctness → Security → Maintainability → Performance.**