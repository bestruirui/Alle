"use client";

import { motion, AnimatePresence } from "framer-motion";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailListInteractions } from "@/components/email/EmailListInteractionsContext";
import DeleteDialog from "@/components/common/DeleteDialog";
import useTranslation from "@/lib/hooks/useTranslation";

interface EmailActionsProps {
  emailId: number;
  emailName: string;
  isSelectionMode: boolean;
}

export default function EmailActions({
  emailId,
  emailName,
  isSelectionMode,
}: EmailActionsProps) {
  const { t } = useTranslation();
  const { onEmailDelete } = useEmailListInteractions();

  if (isSelectionMode || !onEmailDelete) {
    return <div className="w-9 h-9" />;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="email-actions"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        <DeleteDialog
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/10 hover:text-destructive"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                whileHover={{ rotate: -12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Trash2 />
              </motion.div>
            </Button>
          }
          title={t("deleteConfirm")}
          description={t("deleteDescWithName", { name: emailName })}
          onConfirm={(event) => {
            event?.stopPropagation();
            onEmailDelete(emailId);
          }}
          cancelText={t("cancel")}
          confirmText={t("delete")}
        />
      </motion.div>
    </AnimatePresence>
  );
}
