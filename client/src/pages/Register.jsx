import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({
    ucp: '',
    email: '',
    discordid: '',
    phone: '',
    password: '',
    confirm: '',
    captcha: '',
    referral: ''
  })
  const [captchaQuestion, setCaptchaQuestion] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaQuestion(`${num1} + ${num2} = ?`)
    setCaptchaAnswer(num1 + num2)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (parseInt(form.captcha) !== captchaAnswer) {
      setError('Incorrect captcha answer')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post('/api/auth/register', {
        ...form,
        captcha: parseInt(form.captcha)
      })
      if (res.data.success) {
        setSuccess(res.data.message || 'Verification code sent to your email.')
        setTimeout(() => navigate('/verify'), 2000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-[#0A0C10]"
      style={{ backgroundImage: 'radial-gradient(circle at 25% 30%, #1A1F2A 0%, #0A0C10 70%)' }}>
      
      <div className="flex w-full max-w-[780px] bg-[#13171F] border border-[#2A2E35] rounded-xl overflow-hidden shadow-2xl animate__animated animate__fadeIn">
        
        <div className="hidden lg:flex w-[260px] flex-shrink-0 relative bg-[#0A0C10] items-end">
          <img
            src="/images/login-poster.jpg"
            alt="Join Morch"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
          />
          <div className="relative z-10 w-full p-5 pb-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h5 className="font-bold text-base mb-1">Join Morch</h5>
            <p className="text-[#B0B8C5] text-xs mb-2">Start your journey today</p>
            <div className="flex gap-1.5">
              <span className="bg-[#FFE148] text-[#0A0C10] px-2 py-0.5 rounded text-[10px] font-semibold">500+ Players</span>
              <span className="border border-[#2A2E35] text-[#B0B8C5] px-2 py-0.5 rounded text-[10px]">24/7</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          <div className="text-center mb-5">
            <img src="/images/logo.png" alt="Morch" className="w-11 h-11 rounded-lg mx-auto mb-3" />
            <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
            <p className="text-[#8A9BB5] text-sm">Join Morch Community</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-lg text-xs text-center mb-5">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-lg text-xs text-center mb-5">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Username</label>
              <input type="text" name="ucp" maxLength={24} placeholder="Choose a username" value={form.ucp} onChange={handleChange} required
                className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
            </div>
            <div>
              <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Email</label>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required
                className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Discord ID</label>
                <input type="text" name="discordid" placeholder="17-20 digits" value={form.discordid} onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
              </div>
              <div className="flex-1">
                <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Phone (optional)</label>
                <input type="tel" name="phone" placeholder="Your phone" value={form.phone} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Password</label>
                <input type="password" name="password" placeholder="Create password" value={form.password} onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
              </div>
              <div className="flex-1">
                <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Confirm Password</label>
                <input type="password" name="confirm" placeholder="Confirm password" value={form.confirm} onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">{captchaQuestion}</label>
                <input type="number" name="captcha" placeholder="Answer" value={form.captcha} onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
              </div>
              <div className="flex-1">
                <label className="block text-[#8A9BB5] text-xs font-medium mb-1.5">Referral Code</label>
                <input type="text" name="referral" placeholder="Optional" value={form.referral} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#0B0E14] border border-[#2A2E35] rounded-lg text-[#E6E9F0] text-sm outline-none focus:border-[#FFE148] transition-colors duration-200 placeholder:text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm border-none cursor-pointer transition-all duration-200 ${
                loading
                  ? 'bg-[#8A7A3A] text-[#0A0C10] cursor-not-allowed'
                  : 'bg-[#FFE148] text-[#0A0C10] hover:bg-[#E6CA3E] active:scale-[0.98]'
              }`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2E35]" />
            </div>
            <span className="relative px-3 bg-[#13171F] text-[#8A9BB5] text-xs">or</span>
          </div>

          <a
            href="/api/auth/discord"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-sm rounded-lg no-underline transition-colors duration-200 active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.25.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.31.61.68 1.19 1.07 1.74.01.02.04.03.07.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
            </svg>
            Continue with Discord
          </a>

          <p className="text-center text-[#8A9BB5] text-xs mt-5">
            Already have an account? <Link to="/login" className="text-[#FFE148] font-medium no-underline hover:underline">Sign in</Link>
          </p>

          <div className="mt-6 pt-5 border-t border-[#2A2E35] text-center">
            <small className="text-[#5A6A7E] text-[11px]">&copy; 2026 Morch Community</small>
          </div>
        </div>
      </div>
    </div>
  )
}