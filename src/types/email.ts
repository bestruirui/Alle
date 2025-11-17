// ====================
// 邮件数据模型类型
// ====================

export interface Email {
  id: number;
  messageId: string | null;
  fromAddress: string | null;
  fromName: string | null;
  toAddress: string | null;
  recipient: string | null;
  title: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  sentAt: string | null;
  receivedAt: string | null;
  emailType: ExtractResultType;
  emailResult: string | null;
  emailResultText: string | null;
  emailError: string | null;
  readStatus: number;
}

export type NewEmail = Omit<Email, 'id'>;

// ====================
// 邮件提取结果类型
// ====================

export type ExtractResultType =
  | 'internal_link'
  | 'auth_link'
  | 'auth_code'
  | 'service_link'
  | 'subscription_link'
  | 'other_link'
  | 'none';

export interface ExtractResult {
  type: ExtractResultType;
  result: string;
  result_text: string;
}

export const DEFAULT_EXTRACT_RESULT: ExtractResult = {
  type: 'none',
  result: '',
  result_text: '',
};
