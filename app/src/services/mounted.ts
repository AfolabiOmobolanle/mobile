import { useEffect, useRef, useCallback } from 'react';

export const useMountState = () => {
  const mountRef: any = useRef(true);

  useEffect(
    () => () => {
      mountRef.current = false;
    },
    []
  );

  return mountRef.current;
};
