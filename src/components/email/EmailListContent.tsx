"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import EmailListSkeleton from "@/components/email/EmailListSkeleton";
import EmailListEmpty from "@/components/email/EmailListEmpty";
import EmailListItem from "@/components/email/EmailListItem";
import type { Email } from "@/types";

interface EmailListContentProps {
  emails: Email[];
  loading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  selectedEmailId: number | null;
  selectedEmails: Set<number>;
}

export default function EmailListContent({
  emails,
  loading,
  hasMore = false,
  onLoadMore,
  onRefresh,
  selectedEmailId,
  selectedEmails,
}: EmailListContentProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggeredRef = useRef(false);
  const prevEmailCountRef = useRef(emails.length);
  const [resetKey, setResetKey] = useState(0);

  const itemCount = useMemo(() => (hasMore ? emails.length + 1 : emails.length), [emails.length, hasMore]);

  useEffect(() => {
    const currentCount = emails.length;
    const prevCount = prevEmailCountRef.current;

    if (currentCount < prevCount) {
      setResetKey((prev) => prev + 1);
    }

    prevEmailCountRef.current = currentCount;
  }, [emails.length]);

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 8,
    getItemKey: (index) => {
      const email = emails[index];
      return email ? `email-${email.id}` : `loader-${index}`;
    },
  });

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
      key={resetKey}
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

          if (!email) {
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 96,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
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
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <EmailListItem
                email={email}
                index={virtualItem.index}
                isSelected={selectedEmailId === email.id}
                isEmailSelected={selectedEmails.has(email.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}