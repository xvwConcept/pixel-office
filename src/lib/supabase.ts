import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './firebase';

export interface Session {
  user: { id: string; email: string };
}

export interface AuthResponse {
  data: { session: Session | null };
  error: { message: string } | null;
}

// Keep MockSession as alias so existing imports don't break
export type MockSession = Session;

const TEAM_PIN = import.meta.env.VITE_TEAM_PIN as string | undefined;

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return {
      data: { session: { user: { id: cred.user.uid, email: cred.user.email ?? email } } },
      error: null,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Login fehlgeschlagen';
    return { data: { session: null }, error: { message: msg } };
  }
}

export async function signUp(email: string, password: string, pin: string): Promise<AuthResponse> {
  if (pin !== TEAM_PIN) {
    return { data: { session: null }, error: { message: 'Ungültiger Team-PIN' } };
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return {
      data: { session: { user: { id: cred.user.uid, email: cred.user.email ?? email } } },
      error: null,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Registrierung fehlgeschlagen';
    return { data: { session: null }, error: { message: msg } };
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getSession(): Promise<Session | null> {
  // Firebase persists auth state — wait for it to initialise on page load
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      if (!user) { resolve(null); return; }
      resolve({ user: { id: user.uid, email: user.email ?? '' } });
    });
  });
}
