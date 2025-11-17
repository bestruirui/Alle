import type { NextApiResponse } from 'next';

// ====================
// API 响应类型
// ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T | null;
  error: string | null;
  total?: number;
}

type SuccessExtras<T> = Omit<Partial<ApiResponse<T>>, 'success' | 'status' | 'data' | 'error'>;

export const success = <T = unknown>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T = null as T,
  status: number = 200,
  extras: SuccessExtras<T> = {}
): void => {
  res.status(status).json({
    success: true,
    status,
    data,
    error: null,
    ...extras,
  });
};

export const failure = (
  res: NextApiResponse<ApiResponse<never>>,
  error: string,
  status: number = 400
): void => {
  res.status(status).json({
    success: false,
    status,
    data: null,
    error,
  });
};

// ====================
// API 查询参数类型
// ====================

export interface ListParams {
  limit?: number;
  offset?: number;
  readStatus?: number;
  emailType?: string;
  recipient?: string;
}
