/**
 * The standard envelope every Laravel endpoint in this project returns,
 * enforced project-wide (see bootstrap/app.php on the backend).
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]> | string[] | [];

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> | string[] | [] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  fieldError(field: string): string | undefined {
    if (Array.isArray(this.errors)) return undefined;
    return this.errors[field]?.[0];
  }
}
