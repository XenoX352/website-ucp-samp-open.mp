import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import CreateCharacter from './pages/CreateCharacter';

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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}