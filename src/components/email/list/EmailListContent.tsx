"use client";

import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EmailListSkeleton } from "@/components/email/list/EmailListSkeleton";
import { EmailListEmpty } from "@/components/email/list/EmailListEmpty";
import { EmailListItem } from "@/components/email/EmailListItem";
import type { EmailListRenderProps } from "@/components/email/list/types";

interface EmailListContentProps extends EmailListRenderProps {
  loading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
}

export function EmailListContent({
  emails,
  loading,
  hasMore = false,
  onLoadMore,
  onRefresh,
  selectedEmailId,
  selectedEmails,
  copiedId,
  onCopy,
  onEmailClick,
  onEmailDelete,
  onAvatarToggle,
}: EmailListContentProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggeredRef = useRef(false);
  const emailIdsRef = useRef<string>("");

  const itemCount = useMemo(() => (hasMore ? emails.length + 1 : emails.length), [emails.length, hasMore]);

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 8,
    measureElement: (element) => element?.getBoundingClientRect().height ?? 0,
    getItemKey: (index) => {
      const email = emails[index];
      return email ? `email-${email.id}` : `loader-${index}`;
    },
  });

  // 检测 emails 数组的实际内容变化（特别是删除操作）
  useEffect(() => {
    const currentEmailIds = emails.map((e) => e.id).join(",");
    const previousEmailIds = emailIdsRef.current;

    // 如果邮件 ID 序列发生变化（删除、新增、重排），强制重新测量
    if (currentEmailIds !== previousEmailIds && previousEmailIds !== "") {
      // 等待 DOM 更新后再测量
      requestAnimationFrame(() => {
        virtualizer.measure();
      });
    }

    emailIdsRef.current = currentEmailIds;
  }, [emails, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!loading) {
      loadMoreTriggeredRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    if (!hasMore || !onLoadMore || loading || loadMoreTriggeredRef.current) {
      return;
    }

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem && lastItem.index >= emails.length) {
      loadMoreTriggeredRef.current = true;
      onLoadMore();
    }
  }, [virtualItems, emails.length, hasMore, loading, onLoadMore]);

  if (loading && emails.length === 0) {
    return <EmailListSkeleton />;
  }

  if (!loading && emails.length === 0) {
    return <EmailListEmpty onRefresh={onRefresh} />;
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const email = emails[virtualItem.index];
          const style = {
            position: "absolute" as const,
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItem.start}px)`,
          };

          if (!email) {
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{ ...style, height: 96 }}
                className="px-4 py-3"
              >
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            );
          }

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={style}
            >
              <EmailListItem
                email={email}
                index={virtualItem.index}
                isSelected={selectedEmailId === email.id}
                isEmailSelected={selectedEmails.has(email.id)}
                copiedId={copiedId}
                onCopy={onCopy}
                onClick={onEmailClick}
                onDelete={onEmailDelete}
                onAvatarToggle={onAvatarToggle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
