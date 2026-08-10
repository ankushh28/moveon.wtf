'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function LocalTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => setTime(new Date()), 0);
    
    // Update exactly on the next minute
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      setTime(new Date());
      interval = setInterval(() => {
        setTime(new Date());
      }, 60000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!time) return <div className="text-white/0 select-none">00:00 am</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.65 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-4 left-4 z-40 flex items-center justify-center leading-none text-white font-sans text-sm tracking-wide select-none"
    >
      {format(time, 'h:mm a').toLowerCase()}
    </motion.div>
  );
}
