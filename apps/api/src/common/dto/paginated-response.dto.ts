export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export function paginate<T>(
  data: T[],
  { page, limit, totalItems }: { page: number; limit: number; totalItems: number },
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  };
}
