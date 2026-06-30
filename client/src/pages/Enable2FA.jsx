import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Enable2FA() {
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/settings/enable-2fa')
      .then(res => {
        setQr(res.data.qr)
        setSecret(res.data.secret)
      })
      .catch(() => setMessage({ type: 'error', text: 'Failed to generate QR code' }))
  }, [])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (token.length !== 6) return setMessage({ type: 'error', text: 'Enter 6-digit code' })
    setLoading(true)
    try {
      const res = await axios.post('/api/settings/verify-2fa', { token })
      setMessage({ type: 'success', text: res.data.message || '2FA enabled' })
      setTimeout(() => navigate('/settings'), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Verification failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0C10]">
      <div className="w-full max-w-md bg-[#13171F] border border-[#2A2E35] rounded-2xl p-6 shadow-2xl animate__animated animate__fadeInUp">
        <Link to="/settings" className="text-[#FFE148] text-sm hover:underline mb-4 inline-block">
          <i className="bi bi-arrow-left mr-1"></i> Back to Settings
        </Link>
        <h2 className="text-xl font-bold text-white mb-4">Enable Two-Factor Authentication</h2>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white p-4 inline-block rounded-xl mb-4">
          {qr ? (
            <img src={qr} alt="QR Code" className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-gray-400">Loading...</div>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-2">Or enter this secret manually:</p>
        <code className="block bg-[#0A0C10] p-3 rounded-lg text-[#FFE148] font-mono text-sm break-all mb-6">{secret}</code>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">6-digit verification code</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              className="w-full px-4 py-3 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white text-center text-2xl tracking-widest outline-none focus:border-[#FFE148] transition"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg hover:bg-[#E6CA3E] disabled:opacity-60 transition">
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </button>
        </form>
      </div>
    </div>
  )
}