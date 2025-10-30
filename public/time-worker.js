// Web Worker for time formatting calculations
// Offloads formatTime computation from main thread

let referenceTime = Date.now();

function formatTime(date) {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const diff = referenceTime - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const now = new Date(referenceTime);
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

self.addEventListener('message', (e) => {
  const { type, data } = e.data;

  switch (type) {
    case 'FORMAT_TIME': {
      const { id, date } = data;
      const formatted = formatTime(date);
      self.postMessage({ type: 'FORMAT_TIME_RESULT', data: { id, formatted } });
      break;
    }
    case 'BATCH_FORMAT_TIME': {
      const { batchId, items } = data;
      const results = items.map((item) => ({
        id: item.id,
        formatted: formatTime(item.date),
      }));
      self.postMessage({ type: 'BATCH_FORMAT_TIME_RESULT', data: { batchId, results } });
      break;
    }
    case 'SET_REFERENCE_TIME': {
      const { referenceTime: time } = data;
      referenceTime = time;
      break;
    }
    default:
      console.warn('Unknown worker message type:', type);
  }
});
