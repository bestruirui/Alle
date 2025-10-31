"use client";

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
import type { MouseEvent, ReactNode } from "react";

interface DeleteDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: (event?: MouseEvent) => void;
  cancelText: string;
  confirmText: string;
  allowUnsafeHtml?: boolean;
}

export function DeleteDialog({
  trigger,
  title,
  description,
  onConfirm,
  cancelText,
  confirmText,
  allowUnsafeHtml = false,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {allowUnsafeHtml ? (
            <AlertDialogDescription dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
