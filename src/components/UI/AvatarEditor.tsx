import { useState, useEffect } from 'react';
import type { AvatarConfig } from '@/lib/types';
import { AvatarSprite, AVATAR_PRESETS } from '@/components/Avatar/SvgAvatar';

const AVATAR_CONFIG_KEY = 'avatar_config';

const PRESET_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
];

const DEFAULT_CONFIG: AvatarConfig = {
  color: PRESET_COLORS[0],
  displayName: '',
  avatarId: 1,
};

export function loadAvatarConfig(): AvatarConfig {
  try {
    const raw = localStorage.getItem(AVATAR_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AvatarConfig>;
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // ignore malformed data
  }
  return DEFAULT_CONFIG;
}

export function saveAvatarConfig(config: AvatarConfig): void {
  localStorage.setItem(AVATAR_CONFIG_KEY, JSON.stringify(config));
}

interface AvatarPickerProps {
  selected: 1 | 2 | 3 | 4;
  onChange: (id: 1 | 2 | 3 | 4) => void;
}

export function AvatarPicker({ selected, onChange }: AvatarPickerProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {([1, 2, 3, 4] as const).map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all bg-gray-800 ${
            selected === id
              ? 'border-indigo-400 scale-105 shadow-lg shadow-indigo-900/50'
              : 'border-gray-700 hover:border-gray-500'
          }`}
          aria-label={`Avatar ${id}`}
        >
          <AvatarSprite person={AVATAR_PRESETS[id - 1]} size={40} />
        </button>
      ))}
    </div>
  );
}

interface AvatarEditorProps {
  onSave: (config: AvatarConfig) => void;
  initialConfig?: AvatarConfig;
}

export function AvatarEditor({ onSave, initialConfig }: AvatarEditorProps) {
  const [color, setColor] = useState<string>(initialConfig?.color ?? PRESET_COLORS[0]);
  const [displayName, setDisplayName] = useState<string>(initialConfig?.displayName ?? '');
  const [avatarId, setAvatarId] = useState<1 | 2 | 3 | 4>(initialConfig?.avatarId ?? 1);

  useEffect(() => {
    const saved = loadAvatarConfig();
    setColor(saved.color);
    setDisplayName(saved.displayName);
    setAvatarId(saved.avatarId);
  }, []);

  const handleSave = () => {
    const config: AvatarConfig = { color, displayName: displayName.trim(), avatarId };
    saveAvatarConfig(config);
    onSave(config);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 w-80">
      <h2 className="text-white text-lg font-semibold mb-4">Avatar bearbeiten</h2>

      <div className="mb-5">
        <label className="text-gray-400 text-sm mb-3 block">Charakter</label>
        <AvatarPicker selected={avatarId} onChange={setAvatarId} />
      </div>

      <div className="mb-4">
        <label className="text-gray-400 text-sm mb-2 block">Farbe</label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === c ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Farbe ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-gray-400 text-sm mb-2 block">Anzeigename</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Max Mustermann"
          maxLength={32}
          className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Speichern
      </button>
    </div>
  );
}
