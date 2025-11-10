import type { ExtractResultType } from "@/types";

const EMAIL_TYPE_STYLES: Record<
  ExtractResultType,
  {
    bgClass: string;
    textClass: string;
    hasLinkButton?: boolean;
  }
> = {
  auth_link: {
    bgClass: "bg-chart-2/10 border border-chart-2/30",
    textClass: "text-xs text-chart-2",
    hasLinkButton: true,
  },
  auth_code: {
    bgClass: "bg-chart-4/10 border border-chart-4/30",
    textClass: "text-lg font-bold font-mono text-chart-4 tracking-wider",
    hasLinkButton: false,
  },
  service_link: {
    bgClass: "bg-chart-5/10 border border-chart-5/30",
    textClass: "text-xs text-chart-5",
    hasLinkButton: true,
  },
  subscription_link: {
    bgClass: "bg-chart-1/10 border border-chart-1/30",
    textClass: "text-xs text-chart-1",
    hasLinkButton: true,
  },
  other_link: {
    bgClass: "bg-chart-3/10 border border-chart-3/30",
    textClass: "text-xs text-chart-3",
    hasLinkButton: true,
  },
  internal_link: {
    bgClass: "bg-primary/10 border border-primary/30",
    textClass: "text-xs text-primary",
    hasLinkButton: true,
  },
  none: {
    bgClass: "bg-muted/20 border border-border/30",
    textClass: "text-muted-foreground",
    hasLinkButton: false,
  },
};

function getEmailTypeStyle(type: ExtractResultType) {
  return EMAIL_TYPE_STYLES[type] || EMAIL_TYPE_STYLES.none;
}

export default getEmailTypeStyle;
