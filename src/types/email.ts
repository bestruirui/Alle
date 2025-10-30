// ====================
// 邮件数据模型类型
// ====================

export interface Email {
  id: number;
  messageId: string | null;
  fromAddress: string | null;
  fromName: string | null;
  senderAddress: string | null;
  toAddress: string | null;
  recipient: string | null;
  subject: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  sentAt: string | null;
  receivedAt: string | null;
  verificationType: string | null;
  verificationCode: string | null;
  verificationLink: string | null;
  verificationUsed: boolean | null;
  extractResult: string | null;
}

export type NewEmail = Omit<Email, 'id'>;

// ====================
// 邮件提取结果类型
// ====================

export interface ExtractResult {
  type: 'code' | 'link' | 'none';
  code: string;
  link: string;
  error: string;
}

export const DEFAULT_EXTRACT_RESULT: ExtractResult = {
  type: 'none',
  code: '',
  link: '',
  error: '',
};
