const providerKeywordMap: Record<string, string> = {
  // Google 官方通知
  "noreply@google.com": "google",
  "no-reply@accounts.google.com": "google",
  "googleplay-noreply@google.com": "google",

  // Microsoft 官方通知
  "no-reply@microsoft.com": "microsoft",
  "noreply@email.microsoft.com": "microsoft",
  "account-security-noreply@accountprotection.microsoft.com": "microsoft",

  // 社交媒体官方通知
  "notification@facebookmail.com": "facebook",
  "security@facebookmail.com": "facebook",
  "noreply@twitter.com": "twitter",
  "verify@twitter.com": "twitter",
  "no-reply@instagram.com": "instagram",
  "security@mail.instagram.com": "instagram",
  "messages-noreply@linkedin.com": "linkedin",
  "security-noreply@linkedin.com": "linkedin",
  "noreply@tiktok.com": "tiktok",
  "notification@tiktok.com": "tiktok",

  // 企业/开发者服务官方通知
  "noreply@github.com": "github",
  "notifications@github.com": "github",
  "support@github.com": "github",
  "noreply@gitlab.com": "gitlab",
  "support@gitlab.com": "gitlab",
  "noreply@bitbucket.org": "bitbucket",
  "notifications@slack.com": "slack",
  "feedback@slack.com": "slack",
  "noreply@discord.com": "discord",
  "no-reply@discord.com": "discord",
  "team@notion.so": "notion",
  "notifications@notion.so": "notion",
  "no-reply@dropbox.com": "dropbox",
  "notifications@dropbox.com": "dropbox",

  // 电商平台官方通知
  "no-reply@amazon.com": "amazon",
  "auto-confirm@amazon.com": "amazon",
  "ship-confirm@amazon.com": "amazon",
  // "noreply@taobao.com": "taobao",
  // "service@taobao.com": "taobao",
  // "noreply@tmall.com": "tmall",
  // "service@tmall.com": "tmall",
  // "noreply@jd.com": "jd",
  // "service@jd.com": "jd",
  // "noreply@pinduoduo.com": "pinduoduo",
  // "service@pinduoduo.com": "pinduoduo",

  // 支付平台官方通知
  "service@paypal.com": "paypal",
  "service@intl.paypal.com": "paypal",
  "noreply@paypal.com": "paypal",
  // "noreply@alipay.com": "alipay",
  // "service@mail.alipay.com": "alipay",
  // "noreply@wechat.com": "wechat",
  // "service@wechat.com": "wechat",

  // 其他常见服务官方通知
  "info@netflix.com": "netflix",
  "info@mailer.netflix.com": "netflix",
  "no-reply@spotify.com": "spotify",
  "noreply@spotify.com": "spotify",
  "noreply@steampowered.com": "steam",
  "support@steampowered.com": "steam",
  // "help@epicgames.com": "epic",
  // "noreply@epicgames.com": "epic",
  "message@adobe.com": "adobe",
  "noreply@adobe.com": "adobe",

  // Apple 官方通知
  "no_reply@email.apple.com": "apple",
  "appleid@id.apple.com": "apple",
  "do_not_reply@apple.com": "apple",

  // Yahoo 官方通知
  "no-reply@cc.yahoo-inc.com": "yahoo",
  "verify@cc.yahoo-inc.com": "yahoo",

  // 其他国际服务
  "noreply@passport.yandex.com": "yandex",
};

export function getProviderLogo(address: string | null): string | null {
  if (!address) return null;

  const lower = address.toLowerCase();

  for (const [keyword, logoName] of Object.entries(providerKeywordMap)) {
    if (lower.includes(keyword)) {
      return `/image/provider/${logoName}.svg`;
    }
  }

  return null;
}
