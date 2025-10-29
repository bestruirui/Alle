"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProviderLogo, formatTime } from "@/lib/utils/utils";
import type { Email } from "@/lib/db/email";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Trash2, CheckSquare } from "lucide-react";
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

interface CopyButtonProps {
  text: string;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  id: string | number;
}

function CopyButton({ text, copiedId, setCopiedId, id }: CopyButtonProps) {
  const copied = copiedId === String(id);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-xl transition-all duration-200 border-border"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(String(id));
        setTimeout(() => setCopiedId(null), 2000);
      }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3.5 w-3.5 text-chart-2" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

interface EmailListItemProps {
  email: Email;
  index: number;
  isSelected: boolean;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  onClick: (email: Email) => void;
  onDelete?: (emailId: number) => void;
  onAvatarClick?: (email: Email, event: React.MouseEvent) => void;
  isEmailSelected?: boolean;
}

export function EmailListItem({
  email,
  index,
  isSelected,
  copiedId,
  setCopiedId,
  onClick,
  onDelete,
  onAvatarClick,
  isEmailSelected = false
}: EmailListItemProps) {
  const logo = getProviderLogo(email.fromAddress);

  // 检测是否为移动端
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(email.id);
    }
  };

  const handleAvatarClick = (event: React.MouseEvent) => {
    if (onAvatarClick) {
      onAvatarClick(email, event);
    }
  };

  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <div
        className={`px-6 py-5 cursor-pointer transition-all duration-200 group ${
          isSelected && !isMobile
            ? "bg-primary/10 border-l-4 border-l-primary"
            : "hover:bg-accent border-l-4 border-l-transparent"
        }`}
        onClick={() => onClick(email)}
      >
        <div className="flex items-start gap-4">
          {/* Logo/Avatar/Checkbox */}
          <div className="flex-shrink-0">
            <motion.div
              className="w-12 h-12 rounded-xl   shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200"
              onClick={handleAvatarClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: isEmailSelected
                  ? "rgba(var(--primary) / 0.1)"
                  : logo
                    ? "rgba(var(--muted) / 1)"
                    : "rgba(var(--primary) / 0.05)",
                borderColor: isEmailSelected ? "rgba(var(--primary) / 1)" : "transparent",
                borderWidth: isEmailSelected ? "2px" : "0px"
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{
                background: isEmailSelected
                  ? undefined
                  : logo
                    ? undefined
                    : "linear-gradient(135deg, rgba(var(--primary) / 0.2), rgba(var(--primary) / 0.05))"
              }}
            >
              <AnimatePresence mode="wait">
                {isEmailSelected ? (
                  // 选中状态显示复选框
                  <motion.div
                    key="checkbox"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <CheckSquare className="h-6 w-6 text-primary" />
                  </motion.div>
                ) : logo ? (
                  // 有 logo 时显示 logo
                  <motion.div
                    key="logo"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="w-8 h-8 overflow-hidden rounded-lg"
                  >
                    <Image src={logo} alt="" width={32} height={32} className="object-contain" />
                  </motion.div>
                ) : (
                  // 无 logo 时显示首字母头像
                  <motion.span
                    key="initial"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-primary font-semibold text-lg"
                  >
                    {email.fromName?.[0] || "?"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 内容区 */}
          <div className="flex-1 min-w-0 w-0">
            {/* 发件人和时间 */}
            <div className="flex items-start justify-between mb-2 gap-2">
              <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                {email.fromName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatTime(email.receivedAt)}
                </span>
                {/* 删除按钮 */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {!isEmailSelected && onDelete && (
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
                          <AlertDialogTitle>确认删除邮件</AlertDialogTitle>
                          <AlertDialogDescription>
                            您确定要删除这封来自 <strong>{email.fromName}</strong> 的邮件吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete();
                            }}
                            className="bg-destructive text-white hover:bg-destructive/80 active:bg-destructive/70 transition-colors"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
              {email.subject}
            </div>
            {/* 链接预览 */}
            {email.verificationType === 'link' && email.verificationLink && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-chart-3/5 border border-chart-3/20">
                <span className="text-xs text-muted-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                  {email.verificationLink}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl transition-all duration-200"
                    asChild
                  >
                    <a
                      href={email.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <CopyButton
                    text={email.verificationLink}
                    copiedId={copiedId}
                    setCopiedId={setCopiedId}
                    id={`list-link-${email.id}`}
                  />
                </div>
              </div>
            )}

            {/* 验证码预览 */}
            {email.verificationType === 'code' && email.verificationCode && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-lg font-bold font-mono text-primary tracking-wider flex-1">
                  {email.verificationCode}
                </span>
                <div className="flex items-center">
                  <CopyButton
                    text={email.verificationCode}
                    copiedId={copiedId}
                    setCopiedId={setCopiedId}
                    id={`list-code-${email.id}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}