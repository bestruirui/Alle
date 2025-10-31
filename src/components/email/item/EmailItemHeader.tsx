"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/lib/i18n";

interface EmailItemHeaderProps {
  fromName: string;
  subject: string;
  formattedTime: string;
  showDelete: boolean;
  onDelete: () => void;
}

export function EmailItemHeader({
  fromName,
  subject,
  formattedTime,
  showDelete,
  onDelete,
}: EmailItemHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col mb-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground truncate flex-1">
          {fromName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formattedTime}
          </span>
          <div className="w-8 h-8 flex items-center justify-center">
            {showDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteConfirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('deleteDescWithName', { name: fromName })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                      {t('cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="bg-destructive text-white hover:bg-destructive/80 active:bg-destructive/70 transition-colors"
                    >
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
        {subject}
      </div>
    </div>
  );
}
