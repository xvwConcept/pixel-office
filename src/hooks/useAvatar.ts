import { useState, useRef, useCallback, useEffect } from 'react';

const SPEED_PX_PER_S = 120;

export function useAvatar(initialPosition: { x: number; y: number }) {
  const [position, setPosition] = useState(initialPosition);
  const [isMoving, setIsMoving] = useState(false);

  // Mutable refs to avoid stale closures inside rAF loop
  const posRef = useRef(initialPosition);
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  const animate = useCallback((timestamp: number) => {
    const target = targetRef.current;
    if (!target) {
      setIsMoving(false);
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }

    const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
    lastTimeRef.current = timestamp;

    const current = posRef.current;
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const step = SPEED_PX_PER_S * delta;

    if (dist <= step) {
      // Arrived exactly at target
      posRef.current = { x: target.x, y: target.y };
      targetRef.current = null;
      setPosition({ x: target.x, y: target.y });
      setIsMoving(false);
      rafRef.current = null;
      return;
    }

    const ratio = step / dist;
    const newPos = {
      x: current.x + dx * ratio,
      y: current.y + dy * ratio,
    };
    posRef.current = newPos;
    setPosition({ ...newPos });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const moveTo = useCallback(
    (x: number, y: number) => {
      stopAnimation();
      targetRef.current = { x, y };
      setIsMoving(true);
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(animate);
    },
    [animate, stopAnimation],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return { position, moveTo, isMoving };
}
