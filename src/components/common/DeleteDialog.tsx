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

export default function DeleteDialog({
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
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
