import type { NextApiResponse } from 'next';

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

export const success = <T = unknown>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T = null as T,
  status: number = 200
): void => {
  res.status(status).json({
    success: true,
    status,
    data,
    error: null,
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
