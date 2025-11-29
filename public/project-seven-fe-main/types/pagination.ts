export type PaginationQuery = {
  page: number;
  limit: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
};

export type PaginationResponse<T> = {
  data: T[];
  total: number;
};
