import { useState, useCallback, useEffect } from "react";
import type { Email } from "@/types";

export function useEmailSelection(emails: Email[]) {
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());

  useEffect(() => {
    const availableIds = new Set(emails.map((email) => email.id));
    setSelectedEmails((prev) => {
      if (prev.size === 0) {
        return prev;
      }

      const next = new Set<number>();
      prev.forEach((id) => {
        if (availableIds.has(id)) {
          next.add(id);
        }
      });
      return next.size === prev.size ? prev : next;
    });
  }, [emails]);

  const handleSelectAll = useCallback(() => {
    setSelectedEmails((prev) => {
      const isAllSelected = prev.size === emails.length && emails.length > 0;
      return isAllSelected ? new Set() : new Set(emails.map((email) => email.id));
    });
  }, [emails]);

  const handleToggleEmail = useCallback((email: Email) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email.id)) {
        next.delete(email.id);
      } else {
        next.add(email.id);
      }
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedEmails(new Set());
  }, []);

  const isAllSelected = selectedEmails.size === emails.length && emails.length > 0;
  const hasSelection = selectedEmails.size > 0;

  return {
    selectedEmails,
    isAllSelected,
    hasSelection,
    handleSelectAll,
    handleToggleEmail,
    handleClearSelection,
  };
}
