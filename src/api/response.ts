import type { ZodType } from "zod";

/**
 * Canonical API envelope. Backend should converge on this shape:
 * { "data": <resource>, "meta": { ...optional } }
 */
export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export class ApiValidationError extends Error {
  readonly issues: unknown;

  constructor(message: string, issues?: unknown) {
    super(message);
    this.name = "ApiValidationError";
    this.issues = issues;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Unwraps and validates API payloads.
 * Supports the canonical envelope and legacy nested keys from the current backend.
 */
export function parseApiResponse<T>(
  payload: unknown,
  schema: ZodType<T>,
  legacyKeys: string[]
): T {
  const envelope = payload as Partial<ApiEnvelope<unknown>>;

  if (!isRecord(envelope) || envelope.data === undefined) {
    throw new ApiValidationError("Invalid API response: missing top-level data field");
  }

  const direct = schema.safeParse(envelope.data);
  if (direct.success) {
    return direct.data;
  }

  if (isRecord(envelope.data)) {
    for (const key of legacyKeys) {
      if (key in envelope.data) {
        const parsed = schema.safeParse(envelope.data[key]);
        if (parsed.success) {
          return parsed.data;
        }

        throw new ApiValidationError(
          `Invalid API response for legacy key "${key}"`,
          parsed.error.flatten()
        );
      }
    }
  }

  throw new ApiValidationError(
    `Invalid API response: expected one of [${legacyKeys.join(", ")}] or canonical data shape`,
    direct.error.flatten()
  );
}
