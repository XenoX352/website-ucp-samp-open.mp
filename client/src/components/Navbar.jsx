import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/characters', label: 'Characters' },
  { path: '/vehicles', label: 'Vehicles' },
  { path: '/houses', label: 'Houses' },
  { path: '/referral', label: 'Referral' },
  { path: '/donate', label: 'Donate' },
  { path: '/settings', label: 'Settings' },
  { path: '/admin', label: 'Admin Panel' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-5 z-40 bg-transparent">
        <Link to="/dashboard" className="flex items-center">
          <img src="/images/logo.png" alt="Morch" className="h-7 w-7 rounded-lg" />
        </Link>

        <button onClick={() => setOpen(true)} className="text-white p-2 bg-transparent outline-none cursor-pointer" aria-label="Open menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {open && <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />}

      <div ref={drawerRef} className={`fixed top-0 left-0 h-full w-72 bg-[#0A0C10] z-50 transform transition-transform duration-300 ease-in-out flex flex-col items-center py-8 px-6 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setOpen(false)} className="absolute top-5 right-5 text-white bg-[#1A1F2A] rounded-full p-2 hover:bg-[#2A3040] transition" aria-label="Close menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden mb-3">
          <img src="/images/user.png" alt="Profile" className="w-10 h-10 object-contain" />
        </div>
        <span className="text-white text-base font-semibold">{user?.UCP || 'Guest'}</span>
        <span className="text-gray-400 text-xs mt-1">UCP Account</span>

        <nav className="w-full mt-8">
          <ul className="flex flex-col items-center gap-1">
            {menuItems.map((item) => (
              <li key={item.path} className="w-full">
                <Link to={item.path} onClick={() => setOpen(false)} className={`block w-full text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-[#FFE148] text-[#0A0C10]' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-5 mt-8 pt-4 border-t border-[#1A1F2A] w-full justify-center">
          <a href="https://discord.gg/MUvvqUV3aQ" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FFE148] text-xl transition"><i className="bi bi-discord"></i></a>
          <a href="https://tiktok.com/@morchcommunity" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FFE148] text-xl transition"><i className="bi bi-tiktok"></i></a>
          <a href="https://instagram.com/morchcommunity" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FFE148] text-xl transition"><i className="bi bi-instagram"></i></a>
        </div>

        <button onClick={handleLogout} className="mt-6 text-red-400 hover:text-red-300 text-xs font-medium transition">
          Sign Out
        </button>
      </div>
    </>
  );
}