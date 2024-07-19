import { useRef, useEffect } from 'react';

export const isFirstRender = () => {
  const isFirstRef = useRef(true);
  useEffect(() => {
    isFirstRef.current = false;
  }, []);
  return isFirstRef.current;
};

export default isFirstRender