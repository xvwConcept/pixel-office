import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '@/lib/supabase';
import { AvatarPicker, saveAvatarConfig } from '@/components/UI/AvatarEditor';

type Tab = 'login' | 'register';

export function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarId, setAvatarId] = useState<1 | 2 | 3 | 4>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const { data, error: authError } = await signIn(email, password);
        if (authError) {
          setError(authError.message);
        } else if (data.session) {
          navigate('/office');
        }
      } else {
        const { data, error: authError } = await signUp(email, password);
        if (authError) {
          setError(authError.message);
        } else if (data.session) {
          saveAvatarConfig({
            avatarId,
            displayName: displayName.trim(),
            color: '#6366f1',
          });
          navigate('/office');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-start justify-center">
      <div className="max-w-md w-full mx-auto mt-24 bg-gray-900 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white font-sans mb-6 text-center">
          Pixel Office
        </h1>

        <div className="flex bg-gray-800 rounded-full p-1 mb-6">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              tab === 'login' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              tab === 'register' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrieren
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <p className="text-gray-400 text-sm mb-3">Wähle deinen Charakter</p>
              <AvatarPicker selected={avatarId} onChange={setAvatarId} />
            </div>
          )}

          {tab === 'register' && (
            <input
              type="text"
              placeholder="Anzeigename"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              maxLength={32}
              className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-500"
            />
          )}

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-500"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-500"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? '...' : tab === 'login' ? 'Anmelden' : 'Registrieren'}
          </button>
        </form>
      </div>
    </div>
  );
}
