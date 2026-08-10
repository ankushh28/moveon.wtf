'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import backgroundImage from "@/assets/images/backimg.png";

interface BackgroundProps {
  imageUrl?: string;
}

export function Background({ imageUrl }: BackgroundProps) {
  const [mounted, setMounted] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from -1 to 1
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      
      // Move background opposite to mouse, max 20px
      mouseX.set(normalizedX * -20);
      mouseY.set(normalizedY * -20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const defaultImage = "https://images.unsplash.com/photo-1532454642953-b43e7df5d1bf?q=80&w=3270&auto=format&fit=crop";
  const bgImage = backgroundImage;

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)]"
        style={{ x, y }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <Image
          src={bgImage}
          alt="Atmospheric Background"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover"
        />
      </motion.div>
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Subtle film grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] z-10" />
    </div>
  );
}
