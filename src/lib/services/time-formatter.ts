'use client';

interface FormatRequest {
  id: number;
  date: string | null;
}

type WorkerBatchResult = {
  id: number;
  formatted: string;
};

type TimeWorkerMessage =
  | {
      type: 'FORMAT_TIME_RESULT';
      data: {
        id: number;
        formatted: string;
      };
    }
  | {
      type: 'BATCH_FORMAT_TIME_RESULT';
      data: {
        batchId: number;
        results: WorkerBatchResult[];
      };
    };

class TimeFormatterWorkerClient {
  private worker: Worker | null = null;
  private callbacks = new Map<number, (value: string) => void>();
  private batchCallbacks = new Map<number, (value: Record<number, string>) => void>();
  private pendingBatchId = 0;
  private lastReferenceTime = Date.now();

  private ensureWorker() {
    if (this.worker) return;
    if (typeof window === 'undefined') return;

    this.worker = new Worker('/time-worker.js');
    
    this.worker.addEventListener('message', (event: MessageEvent<TimeWorkerMessage>) => {
      const { type, data } = event.data;

      if (type === 'FORMAT_TIME_RESULT') {
        const { id, formatted } = data;
        const callback = this.callbacks.get(id);
        if (callback) {
          callback(formatted);
          this.callbacks.delete(id);
        }
      }

      if (type === 'BATCH_FORMAT_TIME_RESULT') {
        const { batchId, results } = data;
        const callback = this.batchCallbacks.get(batchId);
        if (callback) {
          const mapping: Record<number, string> = {};
          for (const result of results) {
            mapping[result.id] = result.formatted;
          }
          callback(mapping);
          this.batchCallbacks.delete(batchId);
        }
      }
    });
  }

  private updateReferenceTime() {
    if (typeof window === 'undefined') return;
    const now = Date.now();
    if (now - this.lastReferenceTime > 60000) {
      this.setReferenceTime(now);
    }
  }

  setReferenceTime(referenceTime: number) {
    this.lastReferenceTime = referenceTime;
    this.ensureWorker();
    if (!this.worker) return;
    this.worker.postMessage({ type: 'SET_REFERENCE_TIME', data: { referenceTime } });
  }

  formatTime(id: number, date: string | null): Promise<string> {
    this.ensureWorker();

    return new Promise((resolve) => {
      if (!this.worker) {
        resolve('');
        return;
      }

      this.updateReferenceTime();
      this.callbacks.set(id, resolve);
      this.worker.postMessage({ type: 'FORMAT_TIME', data: { id, date } });
    });
  }

  batchFormat(items: FormatRequest[]): Promise<Record<number, string>> {
    this.ensureWorker();

    return new Promise((resolve) => {
      if (!this.worker) {
        resolve({});
        return;
      }

      this.updateReferenceTime();
      const batchId = ++this.pendingBatchId;
      this.batchCallbacks.set(batchId, resolve);
      this.worker.postMessage({ type: 'BATCH_FORMAT_TIME', data: { batchId, items } });
    });
  }
}

export const timeFormatterWorkerClient = new TimeFormatterWorkerClient();
