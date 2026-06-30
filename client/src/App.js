import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import CreateCharacter from './pages/CreateCharacter';
import Houses from './pages/Houses'
import HouseDetail from './pages/HouseDetail'
import Referral from './pages/Referral'
import Donate from './pages/Donate'
import Settings from './pages/Settings'
import Enable2FA from './pages/Enable2FA'
import Vehicles from './pages/Vehicles'
import VehicleDetail from './pages/VehicleDetail'
import Admin from './pages/Admin'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0A0C10]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">
      {user && <Navbar />}
      <main className={user ? 'pt-14' : ''}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/characters" element={<ProtectedRoute><Characters /></ProtectedRoute>} />
          <Route path="/characters/create" element={<ProtectedRoute><CreateCharacter /></ProtectedRoute>} />
          <Route path="/characters/:id" element={<ProtectedRoute><CharacterDetail /></ProtectedRoute>} />
          <Route path="/houses" element={<ProtectedRoute><Houses /></ProtectedRoute>} />
          <Route path="/houses/:id" element={<ProtectedRoute><HouseDetail /></ProtectedRoute>} />
          <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
          <Route path="/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/settings/enable-2fa" element={<ProtectedRoute><Enable2FA /></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
          <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetail /></ProtectedRoute>} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  if (!appReady) {
    return <Loader onFinish={() => setAppReady(true)} />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}