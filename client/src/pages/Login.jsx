import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const success = await doLogin({ login, password });
      if (success) navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0C10] bg-[radial-gradient(circle_at_25%_30%,#1A1F2A,#0A0C10)]">
      <div className="flex max-w-[780px] w-full bg-[#13171F] border border-[#2A2E35] rounded-xl overflow-hidden shadow-2xl animate__animated animate__fadeIn">
        
        {/* Poster - Desktop Only */}
        <div className="hidden lg:block w-[260px] flex-shrink-0 relative bg-[#0A0C10]">
          <img
            src="/images/login-poster.jpg"
            alt="Los Santos"
            className="w-full h-full object-cover brightness-[0.6]"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
            <h5 className="font-bold text-base m-0">Los Santos</h5>
            <p className="text-[#B0B8C5] text-xs mt-1 mb-2">The city of opportunity</p>
            <div className="flex gap-1.5">
              <span className="bg-[#FFE148] text-[#0A0C10] px-2 py-0.5 rounded text-[10px] font-semibold">500+ Players</span>
              <span className="bg-transparent text-[#B0B8C5] border border-[#2A2E35] px-2 py-0.5 rounded text-[10px]">24/7</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <img src="/images/logo.png" alt="Morch" className="w-11 h-11 rounded-lg mx-auto mb-3" />
            <h4 className="font-bold text-white text-lg m-0">Welcome back</h4>
            <p className="text-[#8A9BB5] text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-md text-xs text-center mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#8A9BB5] text-xs mb-1.5">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-md text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-[#8A9BB5] text-xs mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-md text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors placeholder-gray-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-[#8A9BB5] cursor-pointer">
                <input type="checkbox" className="accent-[#FFE148] w-3.5 h-3.5 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-[#FFE148] no-underline hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-md font-bold text-sm border-none cursor-pointer transition-colors ${
                loading ? 'bg-[#8A7A3A] text-[#0A0C10]' : 'bg-[#FFE148] text-[#0A0C10] hover:bg-[#E6CA3E]'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center my-5">
            <span className="bg-[#13171F] px-3 text-[#8A9BB5] text-xs relative z-10">or</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2A2E35] -translate-y-1/2" />
          </div>

          {/* Discord Button */}
          <a
            href="/api/auth/discord"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5865F2] text-white font-semibold text-sm rounded-md no-underline hover:bg-[#4752C4] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.25.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.31.61.68 1.19 1.07 1.74.01.02.04.03.07.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
            </svg>
            Continue with Discord
          </a>

          <p className="text-center text-[#8A9BB5] text-xs mt-5 mb-0">
            Don't have an account? <Link to="/register" className="text-[#FFE148] no-underline font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-6 pt-5 border-t border-[#2A2E35] text-center">
            <small className="text-[#5A6A7E] text-[11px]">&copy; 2026 Morch Community</small>
          </div>
        </div>
      </div>
    </div>
  );
}