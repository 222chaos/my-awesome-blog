import { useCallback, useRef } from 'react';

function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    },
    [callback, delay]
  ) as T;
}

export default useThrottle;
