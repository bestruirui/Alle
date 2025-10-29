import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const providers: Record<string, string> = {
  google: "https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png",
  github: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  twitter: "https://abs.twimg.com/favicons/twitter.2.ico",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  facebook: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  cloudflare: "https://www.cloudflare.com/favicon.ico",
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
