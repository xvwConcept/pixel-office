import { useState, useEffect, useRef } from 'react';
import { detectZone } from '@/lib/zones.config';
import type { ZoneDef } from '@/lib/zones.config';
import type { AvailabilityStatus, AttendanceStatus } from '@/lib/types';

export function useZone(position: { x: number; y: number }) {
  const [currentZone, setCurrentZone] = useState<ZoneDef | null>(() =>
    detectZone(position.x, position.y),
  );

  const prevZoneId = useRef<string | null>(currentZone?.id ?? null);

  useEffect(() => {
    const zone = detectZone(position.x, position.y);
    const zoneId = zone?.id ?? null;

    if (zoneId !== prevZoneId.current) {
      console.log('[Zone] entered:', zoneId ?? 'null');
      prevZoneId.current = zoneId;
      setCurrentZone(zone);
    }
  }, [position.x, position.y]);

  const availability: AvailabilityStatus = currentZone?.availability ?? 'absent';
  const attendance: AttendanceStatus = currentZone?.attendance ?? 'offline';

  return { currentZone, attendance, availability };
}
