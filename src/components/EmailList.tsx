"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RefreshCw, Mail, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDevice } from "@/provider/Device";
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
import { ModeToggle } from "@/components/ModeToggle";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailDetail } from "@/components/email/EmailDetail";
import { EmailListItem } from "@/components/email/EmailListItem";
import type { Email } from "@/types";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  onRefresh: () => void;
  onDelete?: (emailId: number) => void;
  onBatchDelete?: (emailIds: number[]) => void;
}

export default function EmailList({ emails, loading, onRefresh, onDelete, onBatchDelete }: EmailListProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
  const { isMobile } = useDevice();

  const handleEmailClick = (email: Email) => {
    // 正常模式下，点击邮件查看详情
    setSelectedEmail(email);
    // 检测是否为移动端
    if (isMobile) {
      setIsMobileDrawerOpen(true);
    }
  };

  const handleAvatarClick = (email: Email, event: React.MouseEvent) => {
    event.stopPropagation();

    const newSelected = new Set(selectedEmails);
    if (newSelected.has(email.id)) {
      newSelected.delete(email.id);
    } else {
      newSelected.add(email.id);
    }
    setSelectedEmails(newSelected);
  };

  const handleDrawerClose = () => {
    setIsMobileDrawerOpen(false);
  };

  const handleDeleteEmail = async (emailId: number) => {
    if (onDelete) {
      onDelete(emailId);
      // 如果删除的是当前选中的邮件，清除选中状态
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedEmails.size === sortedEmails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(sortedEmails.map(email => email.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (onBatchDelete && selectedEmails.size > 0) {
      onBatchDelete(Array.from(selectedEmails));
      setSelectedEmails(new Set());
      // 如果删除的邮件包含当前选中的邮件，清除选中状态
      if (selectedEmail && selectedEmails.has(selectedEmail.id)) {
        setSelectedEmail(null);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedEmails(new Set());
  };

  // 按日期降序排列邮件（较新的在前）
  const sortedEmails = [...emails].sort((a, b) => {
    const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
    const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
    return dateB - dateA;
  });

  const isAllSelected = selectedEmails.size === sortedEmails.length && sortedEmails.length > 0;
  const hasSelection = selectedEmails.size > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* 双栏布局容器 */}
      <div className="flex h-screen overflow-hidden">
        {/* 左侧邮件列表 */}
        <div className="w-full md:w-[420px] lg:w-[480px] flex-shrink-0 border-r border-border flex flex-col bg-card overflow-hidden">
          {/* 列表头部 */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">收件箱</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {hasSelection
                    ? `已选择 ${selectedEmails.size} 封邮件`
                    : `${sortedEmails.length} 封邮件`
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {hasSelection ? (
                  <>
                    {/* 全选按钮 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSelectAll}
                      className="h-10 w-10 rounded-xl"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>

                    {/* 批量删除按钮 */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认批量删除邮件</AlertDialogTitle>
                          <AlertDialogDescription>
                            您确定要删除选中的 <strong>{selectedEmails.size}</strong> 封邮件吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleBatchDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* 取消选择 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSelection}
                      className="rounded-xl"
                    >
                      取消
                    </Button>
                  </>
                ) : (
                  <>
                    <ModeToggle />
                    <Button
                      size="icon"
                      onClick={onRefresh}
                      disabled={loading}
                      className="h-10 w-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <motion.div
                        animate={{ rotate: loading ? 360 : 0 }}
                        transition={{
                          repeat: loading ? Infinity : 0,
                          duration: 1,
                          ease: "linear"
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 邮件列表 */}
          <ScrollArea className="flex-1 overflow-y-auto">
            {loading && emails.length === 0 ? (
              // 加载骨架屏
              <div className="divide-y divide-border">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-5 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-10 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedEmails.length === 0 ? (
              // 空状态
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 flex-shrink-0">
                  <Mail className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">暂无邮件</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  您的收件箱目前是空的，点击刷新按钮获取最新邮件
                </p>
                <Button onClick={onRefresh} className="rounded-xl flex-shrink-0">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新邮件
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {sortedEmails.map((email, i) => (
                  <EmailListItem
                    key={email.id}
                    email={email}
                    index={i}
                    isSelected={selectedEmail?.id === email.id}
                    copiedId={copiedId}
                    setCopiedId={setCopiedId}
                    onClick={handleEmailClick}
                    onDelete={handleDeleteEmail}
                    onAvatarClick={handleAvatarClick}
                    isEmailSelected={selectedEmails.has(email.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* 右侧详情面板（桌面端） */}
        <div className="hidden md:flex flex-1 bg-background justify-center overflow-hidden">
          <div className="w-full max-w-5xl">
            <EmailDetail email={selectedEmail} />
          </div>
        </div>
      </div>

      {/* 移动端 Drawer */}
      <Drawer
        open={isMobileDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDrawerClose();
          }
        }}
      >
        <DrawerContent className="max-h-[92vh] md:hidden">
          <DrawerHeader className="hidden">
            <DrawerTitle>{selectedEmail?.subject}</DrawerTitle>
            <DrawerDescription>
              来自 {selectedEmail?.fromName}
            </DrawerDescription>
          </DrawerHeader>
          <div className="h-[85vh] overflow-hidden">
            <EmailDetail email={selectedEmail} onClose={handleDrawerClose} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}