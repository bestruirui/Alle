// ====================
// 登录相关类型
// ====================

export interface LoginRequestBody {
  username: string;
  password: string;
  expired?: number | 'none';
}

export interface LoginResponseData {
  token: string;
  exp: number | null;
}

// ====================
// 认证上下文类型
// ====================

export interface AuthToken {
  token: string;
  exp: number | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
