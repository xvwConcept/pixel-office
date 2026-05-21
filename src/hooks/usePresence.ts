import { useCallback, useEffect, useRef, useState } from 'react';
import { ref, set, onValue, onDisconnect, serverTimestamp } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { PresenceState } from '@/lib/types';

// Write own position at most every 80 ms to keep Firebase writes reasonable
const THROTTLE_MS = 80;

export function usePresence(userId: string) {
  const [peers, setPeers] = useState<PresenceState[]>([]);
  const lastWriteRef = useRef<number>(0);
  const pendingRef = useRef<Partial<PresenceState> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to all presence nodes
  useEffect(() => {
    if (!userId) return;
    const presenceRef = ref(db, 'presence');
    const unsub = onValue(presenceRef, (snap) => {
      const all: PresenceState[] = [];
      snap.forEach((child) => {
        if (child.key !== userId) {
          all.push(child.val() as PresenceState);
        }
      });
      setPeers(all);
    });
    return () => unsub();
  }, [userId]);

  // Register onDisconnect cleanup so presence is removed when tab closes
  useEffect(() => {
    if (!userId) return;
    const myRef = ref(db, `presence/${userId}`);
    onDisconnect(myRef).remove();
  }, [userId]);

  const flush = useCallback(
    (state: Partial<PresenceState>) => {
      lastWriteRef.current = Date.now();
      set(ref(db, `presence/${userId}`), {
        ...state,
        userId,
        lastSeen: serverTimestamp(),
      }).catch(() => {/* ignore transient errors */});
    },
    [userId],
  );

  const updatePresence = useCallback(
    (state: Partial<PresenceState>) => {
      const now = Date.now();
      const elapsed = now - lastWriteRef.current;

      if (elapsed >= THROTTLE_MS) {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
        flush(state);
      } else {
        pendingRef.current = state;
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            if (pendingRef.current) { flush(pendingRef.current); pendingRef.current = null; }
          }, THROTTLE_MS - elapsed);
        }
      }
    },
    [flush],
  );

  // Clean up own presence on unmount
  useEffect(() => {
    return () => {
      if (userId) set(ref(db, `presence/${userId}`), null).catch(() => {});
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userId]);

  return { updatePresence, peers };
}
