"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EmailListSkeleton } from "@/components/email/EmailListSkeleton";
import { EmailListEmpty } from "@/components/email/EmailListEmpty";
import { EmailListItem } from "@/components/email/EmailListItem";
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

export function EmailListContent({
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
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <EmailListSkeleton />
      </motion.div>
    );
  }

  if (!loading && emails.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <EmailListEmpty onRefresh={onRefresh} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={resetKey}
      ref={parentRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
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
                <motion.div
                  className="space-y-3"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="h-4 w-3/4 rounded-lg bg-muted" />
                  <div className="h-3 w-1/2 rounded-lg bg-muted" />
                </motion.div>
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
    </motion.div>
  );
}
