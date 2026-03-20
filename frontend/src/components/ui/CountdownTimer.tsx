import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  format?: 'mm:ss' | 'text';
}

export const CountdownTimer = ({ 
  initialSeconds, 
  onComplete, 
  format = 'mm:ss' 
}: CountdownTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (format === 'text') {
      if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      }
      return `${secs}s`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <span className={seconds <= 60 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
      {formatTime(seconds)}
    </span>
  );
};
