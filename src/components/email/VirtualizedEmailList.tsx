'use client';

import { useEffect, useRef, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { List, CellMeasurer, CellMeasurerCache, type ListRowProps } from 'react-virtualized';
import { EmailListItem } from './EmailListItem';
import type { Email } from '@/types';
import { useEmailStore } from '@/lib/store/email-store';

interface VirtualizedEmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  onDelete?: (emailId: number) => void;
  onAvatarClick?: (email: Email, event: React.MouseEvent) => void;
}

export function VirtualizedEmailList({
  emails,
  onEmailClick,
  onDelete,
  onAvatarClick,
}: VirtualizedEmailListProps) {
  const selectedEmail = useEmailStore((state) => state.selectedEmail);
  const selectedEmails = useEmailStore((state) => state.selectedEmails);
  const copiedId = useEmailStore((state) => state.copiedId);
  const setCopiedId = useEmailStore((state) => state.setCopiedId);
  
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 160,
    })
  );

  const sortedEmails = useMemo(() => {
    return [...emails].sort((a, b) => {
      const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [emails]);

  useEffect(() => {
    cache.current.clearAll();
  }, [sortedEmails.length]);

  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
    const email = sortedEmails[index];

    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style} onLoad={measure}>
            <EmailListItem
              email={email}
              index={index}
              isSelected={selectedEmail?.id === email.id}
              copiedId={copiedId}
              setCopiedId={setCopiedId}
              onClick={onEmailClick}
              onDelete={onDelete}
              onAvatarClick={onAvatarClick}
              isEmailSelected={selectedEmails.has(email.id)}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  if (sortedEmails.length === 0) {
    return null;
  }

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          width={width}
          height={height}
          rowCount={sortedEmails.length}
          rowHeight={cache.current.rowHeight}
          rowRenderer={rowRenderer}
          deferredMeasurementCache={cache.current}
          overscanRowCount={3}
        />
      )}
    </AutoSizer>
  );
}
