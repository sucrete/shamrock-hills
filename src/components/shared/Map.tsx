

// src/components/shared/Map.tsx
'use client';

import { useState, useEffect } from 'react';

const Map = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a skeleton or placeholder that matches the SSR dimensions
    return <div className="w-full h-full bg-gray-200 animate-pulse" />;
  }

  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.6705703200987!2d-94.37359169999999!3d38.8628972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c120f57d0c94ef%3A0x4a54e287a593f0f3!2sShamrock%20Hills%20Golf%20Club!5e0!3m2!1sen!2sus!4v1785963269326!5m2!1sen!2sus"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      title="Google Maps"
      className="min-h-[300px] lg:min-h-[450px] h-full"
    />
  );
};

export default Map;