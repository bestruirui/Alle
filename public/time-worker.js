let wasmModulePromise;

const loadWasm = async () => {
  if (!wasmModulePromise) {
    wasmModulePromise = WebAssembly.instantiateStreaming(
      fetch('/time_bucket.wasm')
    );
  }
  return wasmModulePromise;
};

const formatTimeWithBucket = (bucket, diffSeconds, diffMs, now, date, language) => {
  const minutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(diffSeconds / 3600);
  const days = Math.floor(diffSeconds / 86400);

  if (language === 'en') {
    switch (bucket) {
      case 0:
        return 'Just now';
      case 1:
        return `${minutes}m ago`;
      case 2:
        return `${hours}h ago`;
      case 3:
        return `${days}d ago`;
      default:
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== new Date(now).getFullYear() ? 'numeric' : undefined,
        });
    }
  }

  switch (bucket) {
    case 0:
      return '刚刚';
    case 1:
      return `${minutes}分钟前`;
    case 2:
      return `${hours}小时前`;
    case 3:
      return `${days}天前`;
    default:
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date(now).getFullYear() ? 'numeric' : undefined,
      });
  }
};

self.addEventListener('message', async (event) => {
  const { type, emails, now, language } = event.data;

  if (type !== 'FORMAT_TIMES') return;

  const { instance } = await loadWasm();
  const bucketFn = instance.exports.bucket;

  const formatted = emails.map((email) => {
    if (!email.sentAt) {
      return { id: email.id, formattedTime: '' };
    }

    const date = new Date(email.sentAt);
    if (Number.isNaN(date.getTime())) {
      return { id: email.id, formattedTime: '' };
    }

    const diffMs = now - date.getTime();
    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const bucket = bucketFn(diffSeconds);

    return {
      id: email.id,
      formattedTime: formatTimeWithBucket(bucket, diffSeconds, diffMs, now, date, language),
    };
  });

  self.postMessage({
    type: 'FORMATTED_TIMES',
    data: formatted,
  });
});
