'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function RyxenLogo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mount, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-center flex-shrink-0">
      <Image
        src="/logo-ryxen.svg"
        alt="Ryxen"
        width={100}
        height={100}
        className={`h-5`}
      />
    </div>
  );
}
