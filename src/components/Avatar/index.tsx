import type { AvatarConfig, AvailabilityStatus } from '@/lib/types';
import { AvatarSprite, AVATAR_PRESETS } from './SvgAvatar';

const AVATAR_SIZE = 64;

interface AvatarProps {
  userId: string;
  displayName: string;
  avatarConfig: AvatarConfig;
  position: { x: number; y: number };
  availability: AvailabilityStatus;
  isCurrentUser?: boolean;
}

export function Avatar({
  userId: _userId,
  displayName,
  avatarConfig,
  position,
  availability,
  isCurrentUser: _isCurrentUser,
}: AvatarProps) {
  const person = AVATAR_PRESETS[(avatarConfig.avatarId ?? 1) - 1];

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <AvatarSprite person={person} status={availability} size={AVATAR_SIZE} />

      <div
        style={{
          textAlign: 'center',
          fontSize: 9,
          color: '#dddddd',
          marginTop: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {displayName}
      </div>
    </div>
  );
}
