"use client";

import { useState, useRef } from "react";

export function EmailContent({ bodyHtml, bodyText }: { bodyHtml: string | null; bodyText: string | null }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(500);

  // 监听 iframe 加载事件，获取实际高度
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    const body = doc.body;
    const html = doc.documentElement;

    // 获取内容实际高度
    const actualHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    setIframeHeight(actualHeight);
  };

  if (!bodyHtml && !bodyText) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-muted/30 border border-border overflow-hidden">
      <div className="p-5">
        {bodyHtml ? (
          <iframe
            ref={iframeRef}
            srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  ${bodyHtml}
</body>
</html>`}
            style={{
              width: '100%',
              height: `${iframeHeight}px`,
              border: 'none',
              background: 'transparent'
            }}
            onLoad={handleIframeLoad}
            sandbox="allow-same-origin allow-popups allow-forms"
            title="Email Content"
          />
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {bodyText}
          </p>
        )}
      </div>
    </div>
  );
}