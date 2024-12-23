import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    handleResize(); // Initialize on mount

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup
    };
  }, []);

  return width;
}
