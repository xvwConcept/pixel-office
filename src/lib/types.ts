export type AttendanceStatus = 'at-desk' | 'in-meeting' | 'away' | 'offline' | 'sick';
export type AvailabilityStatus = 'available' | 'break' | 'call' | 'meeting' | 'vacation' | 'absent';

export interface AvatarConfig {
  /** CSS colour string, e.g. '#6366f1' */
  color: string;
  /** User display name used to derive initials */
  displayName: string;
  /** Which pixel art character sprite to use (1–4) */
  avatarId: 1 | 2 | 3 | 4;
}

export interface UserSession {
  userId: string;
  email: string;
  displayName: string;
  avatarConfig: AvatarConfig;
}

export interface PresenceState {
  userId: string;
  position: { x: number; y: number };
  attendance: AttendanceStatus;
  availability: AvailabilityStatus;
  avatarConfig: AvatarConfig;
}
