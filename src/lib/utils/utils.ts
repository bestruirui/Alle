import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const providers: Record<string, string> = {
  google: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/gmail.svg",
  github: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/github.svg",
  twitter: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/twitter.svg",
  microsoft: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/microsoft.svg",
  apple: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/apple.svg",
  facebook: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/facebook.svg",
  cloudflare: "https://cdn.jsdelivr.net/gh/selfhst/icons/svg/cloudflare.svg",
};

export function getProviderLogo(address: string | null) {
  if (!address) return null;
  const lower = address.toLowerCase();
  for (const key of Object.keys(providers)) {
    if (lower.includes(key)) return providers[key];
  }
  return null;
}

export function formatTime(date: Date | string | null | undefined) {
  if (!date) return "";

  // 确保输入的时间被正确解析为 Date 对象
  // 如果是 UTC 时间字符串，会自动转换为本地时间
  const d = new Date(date);

  // 检查日期是否有效
  if (isNaN(d.getTime())) return "";

  // 获取当前本地时间
  const now = new Date();

  // 计算时间差（都是本地时间，所以差值是准确的）
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  // 对于超过7天的时间，显示本地化的日期格式
  return d.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    // 如果是不同年份，也显示年份
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
}
