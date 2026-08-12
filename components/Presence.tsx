'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'motion/react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function Presence() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      const t = setTimeout(() => setCount(null), 0); // Silent fallback
      return () => clearTimeout(t);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const roomOne = supabase.channel('notreachable_room', {
      config: {
        presence: {
          key: Math.random().toString(36).substring(7),
        },
      },
    });

    roomOne
      .on('presence', { event: 'sync' }, () => {
        const newState = roomOne.presenceState();
        const activeUsers = Object.keys(newState).length;
        setCount(activeUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await roomOne.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      roomOne.unsubscribe();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 text-xs tracking-wider select-none z-40"
    >
      {count !== null ? (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-[#2DD36F] shadow-[0_0_8px_#2DD36F] animate-pulse" />
          <span>{count.toLocaleString()} riders on the route</span>
        </>
      ) : (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span>route in motion</span>
        </>
      )}
    </motion.div>
  );
}
