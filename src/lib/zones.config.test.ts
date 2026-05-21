import { describe, it, expect } from 'vitest';
import { detectZone, ZONES } from './zones.config';

describe('detectZone', () => {
  it('returns null for a point outside all zones', () => {
    expect(detectZone(0, 0)).toBeNull();
    expect(detectZone(1023, 767)).toBeNull();
    expect(detectZone(560, 400)).toBeNull();
  });

  it('detects main-office for a point clearly inside it', () => {
    const zone = detectZone(200, 200);
    expect(zone?.id).toBe('main-office');
    expect(zone?.attendance).toBe('at-desk');
    expect(zone?.availability).toBe('available');
  });

  it('detects meeting-room for a point clearly inside it', () => {
    const zone = detectZone(700, 150);
    expect(zone?.id).toBe('meeting-room');
    expect(zone?.attendance).toBe('in-meeting');
    expect(zone?.availability).toBe('meeting');
  });

  it('detects coffee-station for a point clearly inside it', () => {
    const zone = detectZone(100, 600);
    expect(zone?.id).toBe('coffee-station');
    expect(zone?.attendance).toBe('away');
    expect(zone?.availability).toBe('break');
  });

  it('detects exit-door for a point clearly inside it', () => {
    const zone = detectZone(940, 600);
    expect(zone?.id).toBe('exit-door');
    expect(zone?.attendance).toBe('away');
    expect(zone?.availability).toBe('absent');
  });

  it('detects globe-vacation for a point clearly inside it', () => {
    const zone = detectZone(270, 600);
    expect(zone?.id).toBe('globe-vacation');
    expect(zone?.attendance).toBe('away');
    expect(zone?.availability).toBe('vacation');
  });

  it('returns null in the gap between main-office and meeting-room', () => {
    expect(detectZone(555, 200)).toBeNull();
  });

  it('detects zone at boundary (top-left corner)', () => {
    const mainOffice = ZONES.find(z => z.id === 'main-office')!;
    const zone = detectZone(mainOffice.x, mainOffice.y);
    expect(zone?.id).toBe('main-office');
  });

  it('detects zone at boundary (bottom-right corner)', () => {
    const mainOffice = ZONES.find(z => z.id === 'main-office')!;
    const zone = detectZone(mainOffice.x + mainOffice.width, mainOffice.y + mainOffice.height);
    expect(zone?.id).toBe('main-office');
  });

  it('ZONES array has exactly 5 zones', () => {
    expect(ZONES).toHaveLength(5);
  });
});
