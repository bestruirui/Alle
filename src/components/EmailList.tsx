import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Copy, Check, RefreshCw, Mail, ExternalLink, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Email } from "@/lib/db/email";

const providers: Record<string, string> = {
  google: "https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png",
  github: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  twitter: "https://abs.twimg.com/favicons/twitter.2.ico",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  facebook: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  cloudflare: "https://www.cloudflare.com/favicon.ico",
};

function getProviderLogo(address: string | null) {
  if (!address) return null;
  const lower = address.toLowerCase();
  for (const key of Object.keys(providers)) {
    if (lower.includes(key)) return providers[key];
  }
  return null;
}

function formatTime(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  onRefresh: () => void;
}

// 可复用的复制按钮组件
interface CopyButtonProps {
  text: string;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  id: string | number;
  size?: "sm" | "md" | "lg";
}

function CopyButton({ text, copiedId, setCopiedId, id, size = "md" }: CopyButtonProps) {
  const copied = copiedId === String(id);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`${sizeClasses[size]} rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm hover:shadow-md border-border`}
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
            <Check className={`${iconSizes[size]} text-chart-2`} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

// 验证码卡片组件
interface VerificationCodeCardProps {
  code: string;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  emailId: number;
}

function VerificationCodeCard({ code, copiedId, setCopiedId, emailId }: VerificationCodeCardProps) {
  const formatCode = (code: string) => {
    const chars = code.split('');
    const length = chars.length;

    return chars.map((char, idx) => {
      const needsSpace = (length === 4 && idx === 1) || (length === 6 && idx === 2);
      return (
        <span key={idx} className="inline-flex">
          <span className="inline-flex items-center justify-center w-10 h-14 md:w-12 md:h-16 rounded-lg bg-primary/5 border border-primary/20 text-2xl md:text-3xl font-bold font-mono">
            {char}
          </span>
          {needsSpace && <span className="inline-block w-3 md:w-4"></span>}
          {!needsSpace && idx < length - 1 && <span className="inline-block w-1.5 md:w-2"></span>}
        </span>
      );
    });
  };

  return (
    <div className="group relative p-4 md:p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          验证码
        </span>
        <CopyButton
          text={code}
          copiedId={copiedId}
          setCopiedId={setCopiedId}
          id={`code-${emailId}`}
          size="sm"
        />
      </div>
      <div className="flex items-center justify-center">
        {formatCode(code)}
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">点击右上角复制</p>
      </div>
    </div>
  );
}

// 验证链接卡片组件
interface VerificationLinkCardProps {
  link: string;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  emailId: number;
}

function VerificationLinkCard({ link, copiedId, setCopiedId, emailId }: VerificationLinkCardProps) {
  return (
    <div className="group relative p-4 md:p-5 rounded-2xl bg-gradient-to-br from-chart-3/5 via-chart-3/3 to-transparent border-2 border-chart-3/20 hover:border-chart-3/40 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-chart-3 animate-pulse"></span>
          验证链接
        </span>
        <div className="flex items-center gap-2">
          <CopyButton
            text={link}
            copiedId={copiedId}
            setCopiedId={setCopiedId}
            id={`link-${emailId}`}
            size="sm"
          />
        </div>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 rounded-xl bg-card hover:bg-accent border border-border transition-all duration-200 group/link"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="h-4 w-4 text-chart-3 flex-shrink-0 group-hover/link:scale-110 transition-transform" />
        <span className="text-sm font-medium text-foreground truncate flex-1">
          {link}
        </span>
      </a>
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">点击链接访问或复制</p>
      </div>
    </div>
  );
}

// 智能缩放的邮件内容组件
interface EmailContentProps {
  bodyHtml: string | null;
  bodyText: string | null;
}

function EmailContent({ bodyHtml, bodyText }: EmailContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !contentRef.current || !bodyHtml) {
        setScale(1);
        return;
      }

      // 查找实际的容器元素
      // 如果父元素是 ScrollArea，需要找到 ScrollAreaPrimitive.Viewport
      let actualContainer: HTMLElement = containerRef.current;
      const viewport = containerRef.current.closest('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        actualContainer = viewport as HTMLElement;
      }

      // 获取容器宽度（减去 padding）
      const containerWidth = actualContainer.clientWidth - 40; // 20px padding on each side

      // 获取内容实际宽度
      const actualContentWidth = contentRef.current.scrollWidth;

      // 获取内容实际高度
      const actualHeight = contentRef.current.scrollHeight;

      // 计算缩放比例 - 只缩小，不放大
      let newScale = 1;

      if (actualContentWidth > containerWidth) {
        // 内容太宽，需要缩小
        newScale = containerWidth / actualContentWidth;
        // 限制最小缩放比例为 0.5，避免内容太小看不清
        newScale = Math.max(0.5, newScale);
      }
      setScale(newScale);
      setContentHeight(actualHeight * newScale);
    };

    // 初始计算
    const timer = setTimeout(calculateScale, 100);

    // 监听窗口大小变化
    window.addEventListener('resize', calculateScale);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateScale);
    };
  }, [bodyHtml]);

  if (!bodyHtml && !bodyText) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-muted/30 border border-border overflow-hidden"
    >
      <div className="p-5 relative">
        {bodyHtml ? (
          <>
            {/* 缩放比例提示（仅当缩放时显示） */}
            {scale !== 1 && (
              <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-md bg-primary/10 backdrop-blur-sm border border-primary/20">
                <span className="text-xs font-medium text-primary">
                  已缩小 {Math.round(scale * 100)}%
                </span>
              </div>
            )}

            <div
              style={{
                height: contentHeight || 'auto',
                position: 'relative',
                minHeight: '100px'
              }}
            >
              <div
                ref={contentRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: `${100 / scale}%`,
                  position: scale !== 1 ? 'absolute' : 'relative',
                  top: 0,
                  left: 0,
                  transition: 'transform 0.3s ease-out'
                }}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {bodyText}
          </p>
        )}
      </div>
    </div>
  );
}

// 邮件详情内容组件
interface EmailDetailProps {
  email: Email | null;
  copiedId: string | null;
  setCopiedId: (id: string | null) => void;
  onClose?: () => void;
}

function EmailDetail({ email, copiedId, setCopiedId, onClose }: EmailDetailProps) {
  if (!email) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Mail className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">选择一封邮件</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            从左侧列表中选择一封邮件以查看详细内容
          </p>
        </div>
      </div>
    );
  }

  const logo = getProviderLogo(email.fromAddress);

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Logo */}
              <div className="flex-shrink-0">
                {logo ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-sm">
                    <img src={logo} alt="" className="w-9 h-9 object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                    <span className="text-primary font-bold text-2xl">
                      {email.fromName?.[0] || "?"}
                    </span>
                  </div>
                )}
              </div>

              {/* 发件人信息 */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground mb-1 truncate">
                  {email.fromName}
                </h2>
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {email.fromAddress}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTime(email.receivedAt)}</span>
                </div>
              </div>
            </div>

            {/* 关闭按钮（仅移动端） */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden h-10 w-10 rounded-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* 主题 */}
          <h3 className="text-base font-semibold text-foreground mb-4 leading-relaxed">
            {email.subject}
          </h3>
        </div>
      </div>

      {/* 内容区域 */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* 邮件正文 */}
          <EmailContent
            bodyHtml={email.bodyHtml}
            bodyText={email.bodyText}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

export default function EmailList({ emails, loading, onRefresh }: EmailListProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    // 检测是否为移动端
    if (window.innerWidth < 768) {
      setIsMobileDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 双栏布局容器 */}
      <div className="flex h-screen overflow-hidden">
        {/* 左侧邮件列表 */}
        <div className="w-full md:w-[420px] lg:w-[480px] flex-shrink-0 border-r border-border overflow-hidden flex flex-col bg-card">
          {/* 列表头部 */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">收件箱</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {emails.length} 封邮件
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                      <div className="w-12 h-12 rounded-full bg-muted"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-10 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : emails.length === 0 ? (
              // 空状态
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Mail className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">暂无邮件</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  您的收件箱目前是空的，点击刷新按钮获取最新邮件
                </p>
                <Button onClick={onRefresh} className="rounded-xl">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新邮件
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {emails.map((email, i) => {
                  const logo = getProviderLogo(email.fromAddress);
                  const isSelected = selectedEmail?.id === email.id;

                  return (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                    >
                      <div
                        className={`px-6 py-5 cursor-pointer transition-all duration-200 ${isSelected
                          ? "bg-primary/10 border-l-4 border-l-primary"
                          : "hover:bg-accent border-l-4 border-l-transparent"
                          }`}
                        onClick={() => handleEmailClick(email)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Logo */}
                          <div className="flex-shrink-0">
                            {logo ? (
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center shadow-sm">
                                <img src={logo} alt="" className="w-8 h-8 object-contain" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                                <span className="text-primary font-semibold text-lg">
                                  {email.fromName?.[0] || "?"}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 内容区 */}
                          <div className="flex-1 min-w-0">
                            {/* 发件人和时间 */}
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                                {email.fromName}
                              </h3>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatTime(email.receivedAt)}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground truncate mb-3">
                              {email.fromAddress}
                            </p>

                            {/* 验证码预览 */}
                            {email.verificationCode && (
                              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                                <span className="text-lg font-bold font-mono text-primary tracking-wider flex-1">
                                  {email.verificationCode}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs hover:bg-primary/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(email.verificationCode!);
                                    setCopiedId(`list-code-${email.id}`);
                                    setTimeout(() => setCopiedId(null), 2000);
                                  }}
                                >
                                  {copiedId === `list-code-${email.id}` ? (
                                    <>
                                      <Check className="h-3 w-3 mr-1 text-chart-2" />
                                      已复制
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3 mr-1" />
                                      复制
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                            {/* 链接预览 */}
                            {email.verificationLink && !email.verificationCode && (
                              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-chart-3/5 border border-chart-3/20">
                                <ExternalLink className="h-3.5 w-3.5 text-chart-3 flex-shrink-0" />
                                <span className="text-xs text-muted-foreground truncate flex-1">
                                  验证链接
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs hover:bg-chart-3/10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(email.verificationLink!);
                                      setCopiedId(`list-link-${email.id}`);
                                      setTimeout(() => setCopiedId(null), 2000);
                                    }}
                                  >
                                    {copiedId === `list-link-${email.id}` ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1 text-chart-2" />
                                        已复制
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3 w-3 mr-1" />
                                        复制
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs hover:bg-chart-3/10"
                                    asChild
                                  >
                                    <a
                                      href={email.verificationLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      访问
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </ScrollArea >
        </div>

        {/* 右侧详情面板（桌面端） */}
        <div className="hidden md:flex flex-1 bg-background overflow-hidden justify-center">
          <div className="w-full max-w-5xl">
            <EmailDetail
              email={selectedEmail}
              copiedId={copiedId}
              setCopiedId={setCopiedId}
            />
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
            <EmailDetail
              email={selectedEmail}
              copiedId={copiedId}
              setCopiedId={setCopiedId}
              onClose={handleDrawerClose}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
