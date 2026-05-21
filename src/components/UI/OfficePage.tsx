import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Office } from '@/components/Office';
import { Avatar } from '@/components/Avatar';
import { AvatarEditor, loadAvatarConfig } from '@/components/UI/AvatarEditor';
import { useAvatar } from '@/hooks/useAvatar';
import { useZone } from '@/hooks/useZone';
import { usePresence } from '@/hooks/usePresence';
import { getSession, signOut } from '@/lib/supabase';
import type { AvatarConfig } from '@/lib/types';
import type { Session } from '@/lib/supabase';

const SPAWN: { x: number; y: number } = { x: 200, y: 280 };

export function OfficePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(loadAvatarConfig);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      if (!s) { navigate('/login'); return; }
      setSession(s);
    });
  }, [navigate]);

  const userId = session?.user.id ?? '';
  const displayName = avatarConfig.displayName || session?.user.email?.split('@')[0] || 'User';

  const { position, moveTo } = useAvatar(SPAWN);
  const { attendance, availability } = useZone(position);
  const { updatePresence, peers } = usePresence(userId);

  useEffect(() => {
    if (!userId) return;
    updatePresence({ userId, position, attendance, availability, avatarConfig });
  }, [position, attendance, availability, userId, avatarConfig, updatePresence]);

  // Walk to exit → sign out
  useEffect(() => {
    if (availability === 'absent' && attendance === 'away') {
      const timeout = setTimeout(async () => {
        await signOut();
        navigate('/login');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [availability, attendance, navigate]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Laden...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative">
      {/* Settings */}
      <button
        type="button"
        onClick={() => setShowEditor(true)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors z-10"
        aria-label="Einstellungen"
      >
        ⚙
      </button>

      {/* Status bar */}
      <div className="absolute top-4 left-4 text-sm text-gray-400 z-10">
        <span className="text-white font-medium">{displayName}</span>
        {' · '}
        <span>{attendance}</span>
        {' · '}
        <span>{availability}</span>
      </div>

      {/* Canvas + avatars */}
      <Office onCanvasClick={moveTo}>
        {/* Current user */}
        <Avatar
          userId={userId}
          displayName={displayName}
          avatarConfig={avatarConfig}
          position={position}
          availability={availability}
          isCurrentUser
        />

        {/* Peers */}
        {peers.map((peer) => (
          <Avatar
            key={peer.userId}
            userId={peer.userId}
            displayName={peer.avatarConfig?.displayName || peer.userId}
            avatarConfig={peer.avatarConfig}
            position={peer.position}
            availability={peer.availability}
          />
        ))}
      </Office>

      {/* Avatar editor modal */}
      {showEditor && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowEditor(false); }}
        >
          <AvatarEditor
            onSave={(config) => { setAvatarConfig(config); setShowEditor(false); }}
            initialConfig={avatarConfig}
          />
        </div>
      )}
    </div>
  );
}
