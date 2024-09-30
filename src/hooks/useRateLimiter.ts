// src/hooks/useRateLimiter.ts

import { useState, useCallback } from "react";

export const useRateLimiter = (limit: number, interval: number) => {
  const [queue, setQueue] = useState<(() => Promise<any>)[]>([]);
  const [processing, setProcessing] = useState(false);

  const enqueue = useCallback((func: () => Promise<any>) => {
    setQueue((prevQueue) => [...prevQueue, func]);
  }, []);

  const processQueue = useCallback(async () => {
    if (processing || queue.length === 0) return;

    setProcessing(true);
    const batchSize = Math.min(limit, queue.length);
    const batch = queue.slice(0, batchSize);
    setQueue((prevQueue) => prevQueue.slice(batchSize));

    await Promise.all(batch.map((func) => func()));

    setTimeout(() => {
      setProcessing(false);
      processQueue();
    }, interval);
  }, [processing, queue, limit, interval]);

  return { enqueue, processQueue };
};
