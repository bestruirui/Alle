"use client";

import { useEffect, useRef, useCallback } from "react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List } from "react-virtualized";
import type { ListRowRenderer } from "react-virtualized";
import { EmailListSkeleton } from "@/components/email/list/EmailListSkeleton";
import { EmailListEmpty } from "@/components/email/list/EmailListEmpty";
import { EmailListItem } from "@/components/email/EmailListItem";
import type { EmailListRenderProps } from "@/components/email/list/types";
import { useFormatTime } from "@/lib/hooks/useFormatTime";

const cache = new CellMeasurerCache({ fixedWidth: true, defaultHeight: 120 });

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
  const listRef = useRef<List | null>(null);
  const formatTime = useFormatTime();

  useEffect(() => {
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [emails]);

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => Boolean(emails[index]),
    [emails],
  );

  const loadMoreRows = useCallback(async () => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, key, style, parent }) => {
      const email = emails[index];

      if (!email) {
        return (
          <div key={key} style={style} className="px-4 py-3">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        );
      }

      // 按需格式化时间：仅格式化可见的邮件
      const formattedTime = formatTime(email.sentAt);

      return (
        <CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
          {({ registerChild }) => (
            <div
              ref={(node) => {
                registerChild(node);
              }}
              style={style}
            >
              <EmailListItem
                email={email}
                index={index}
                isSelected={selectedEmailId === email.id}
                isEmailSelected={selectedEmails.has(email.id)}
                formattedTime={formattedTime}
                copiedId={copiedId}
                onCopy={onCopy}
                onClick={onEmailClick}
                onDelete={onEmailDelete}
                onAvatarToggle={onAvatarToggle}
              />
            </div>
          )}
        </CellMeasurer>
      );
    },
    [copiedId, emails, formatTime, onAvatarToggle, onCopy, onEmailClick, onEmailDelete, selectedEmailId, selectedEmails],
  );

  if (loading && emails.length === 0) {
    return <EmailListSkeleton />;
  }

  if (!loading && emails.length === 0) {
    return <EmailListEmpty onRefresh={onRefresh} />;
  }

  return (
    <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={hasMore ? emails.length + 10 : emails.length}>
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={(ref) => {
                listRef.current = ref;
                registerChild(ref);
              }}
              height={height}
              width={width}
              rowCount={emails.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              onRowsRendered={onRowsRendered}
              deferredMeasurementCache={cache}
              overscanRowCount={5}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
}
