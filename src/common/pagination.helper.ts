import { PaginationDto } from './pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function getPrismaPageArgs(pagination?: PaginationDto) {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginatedResult<T>(
  data: T[],
  totalItems: number,
  pagination?: PaginationDto,
): PaginatedResult<T> {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
