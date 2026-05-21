import type { AttendanceStatus, AvailabilityStatus } from '@/lib/types';

export type ZoneId =
  | 'main-office'
  | 'meeting-room'
  | 'coffee-station'
  | 'exit-door'
  | 'globe-vacation';

export interface ZoneDef {
  id: ZoneId;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  attendance: AttendanceStatus;
  availability: AvailabilityStatus;
  /** PixiJS fill color for rendering */
  fillColor: number;
}

export const ZONES: ZoneDef[] = [
  {
    id: 'main-office',
    label: 'Main Office',
    x: 50, y: 80, width: 500, height: 400,
    attendance: 'at-desk',
    availability: 'available',
    fillColor: 0x2d3561,
  },
  {
    id: 'meeting-room',
    label: 'Meeting Room',
    x: 600, y: 80, width: 300, height: 250,
    attendance: 'in-meeting',
    availability: 'meeting',
    fillColor: 0x0d6e6e,
  },
  {
    id: 'coffee-station',
    label: 'Coffee',
    x: 50, y: 550, width: 120, height: 120,
    attendance: 'away',
    availability: 'break',
    fillColor: 0x7b4f2e,
  },
  {
    id: 'exit-door',
    label: 'Exit',
    x: 900, y: 550, width: 100, height: 150,
    attendance: 'away',
    availability: 'absent',
    fillColor: 0x4a4a4a,
  },
  {
    id: 'globe-vacation',
    label: 'Globe',
    x: 220, y: 550, width: 120, height: 120,
    attendance: 'away',
    availability: 'vacation',
    fillColor: 0x1a6b8a,
  },
];

export function detectZone(x: number, y: number): ZoneDef | null {
  for (const zone of ZONES) {
    if (
      x >= zone.x &&
      x <= zone.x + zone.width &&
      y >= zone.y &&
      y <= zone.y + zone.height
    ) {
      return zone;
    }
  }
  return null;
}

export const DESK_ASSIGNMENTS: Record<string, ZoneId> = {
  'user-1': 'main-office',
  'user-2': 'main-office',
  'user-3': 'main-office',
  'user-4': 'main-office',
  'user-5': 'main-office',
  'user-6': 'main-office',
};
