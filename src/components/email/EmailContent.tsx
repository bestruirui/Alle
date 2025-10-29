"use client";

import { useState, useEffect, useRef } from "react";

interface EmailContentProps {
  bodyHtml: string | null;
  bodyText: string | null;
}

export function EmailContent({ bodyHtml, bodyText }: EmailContentProps) {
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