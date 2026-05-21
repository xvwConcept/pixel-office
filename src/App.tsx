import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/components/UI/LoginPage';
import { OfficePage } from '@/components/UI/OfficePage';
import { AuthGuard } from '@/components/UI/AuthGuard';
import { getSession } from '@/lib/supabase';

function RootRedirect() {
  const [target, setTarget] = useState<'/login' | '/office' | null>(null);

  useEffect(() => {
    getSession().then((s) => setTarget(s ? '/office' : '/login'));
  }, []);

  if (!target) return null;
  return <Navigate to={target} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/office"
          element={
            <AuthGuard>
              <OfficePage />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
