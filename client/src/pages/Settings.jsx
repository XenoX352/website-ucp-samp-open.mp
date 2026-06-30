import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user, checkSession } = useAuth()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/settings')
      setSettings(res.data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleSubmit = async (endpoint, data) => {
    try {
      const res = await axios.post(endpoint, data)
      showMessage('success', res.data.message || 'Updated successfully')
      await checkSession()
      fetchSettings()
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Update failed')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-10">
          <i className="bi bi-exclamation-triangle text-5xl text-gray-500 mb-4 block" />
          <h3 className="text-xl font-semibold text-white mb-2">Settings Unavailable</h3>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <i className="bi bi-gear text-[#FFE148]"></i> Account Settings
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage your account preferences and security.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'profile' ? 'bg-[#FFE148] text-[#0A0C10]' : 'bg-[#13171F] text-gray-400 border border-[#2A2E35]'}`}
          >
            <i className="bi bi-person mr-1"></i> Profile
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'security' ? 'bg-[#FFE148] text-[#0A0C10]' : 'bg-[#13171F] text-gray-400 border border-[#2A2E35]'}`}
          >
            <i className="bi bi-shield-lock mr-1"></i> Security
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {activeSection === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingsCard title="UCP Name" icon="bi-person-badge">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('/api/settings/change-ucp', { newUCP: e.target.newUCP.value }) }}>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">Current</label>
                <input type="text" value={settings.UCP} disabled className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-gray-400" />
              </div>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">New UCP Name</label>
                <input type="text" name="newUCP" maxLength={24} required className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] transition" placeholder="Enter new username" />
                <p className="text-xs text-gray-500 mt-1">3-24 chars, letters, numbers, underscore only.</p>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition">Update UCP Name</button>
            </form>
          </SettingsCard>

          <SettingsCard title="Discord ID" icon="bi-discord">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('/api/settings/change-discord', { discordId: e.target.discordId.value }) }}>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">Current Discord</label>
                <input type="text" value={settings.discord_username || settings.discordid || 'Not linked'} disabled className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-gray-400" />
              </div>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">New Discord ID (17-20 digits)</label>
                <input type="text" name="discordId" placeholder="Enter Discord ID" required className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] transition" />
                <p className="text-xs text-gray-500 mt-1">Enable Developer Mode in Discord to copy your ID.</p>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition">Update Discord ID</button>
            </form>
          </SettingsCard>

          <SettingsCard title="Email Address" icon="bi-envelope">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('/api/settings/change-email', { newEmail: e.target.newEmail.value }) }}>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">Current</label>
                <input type="email" value={settings.email} disabled className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-gray-400" />
              </div>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">New Email</label>
                <input type="email" name="newEmail" required className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] transition" placeholder="Enter new email" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition">Update Email</button>
            </form>
          </SettingsCard>

          <SettingsCard title="Account Stats" icon="bi-graph-up">
            <div className="space-y-2">
              <InfoRow label="First IP (Registration)" value={settings.FirstIP || 'Not recorded'} />
              <InfoRow label="Last IP (Login)" value={settings.LastIP || 'Not recorded'} />
              <InfoRow label="Admin Level" value={settings.AdminLevel || 0} highlight />
              <InfoRow label="mgold Balance" value={settings.mgold || 0} highlight />
              <InfoRow label="Referral Code" value={settings.referral_code || 'N/A'} mono />
            </div>
          </SettingsCard>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingsCard title="Change Password" icon="bi-key">
            <form onSubmit={(e) => {
              e.preventDefault()
              const current = e.target.current.value
              const newPassword = e.target.newPassword.value
              const confirm = e.target.confirm.value
              if (newPassword !== confirm) return showMessage('error', 'Passwords do not match')
              handleSubmit('/api/settings/change-password', { current, newPassword, confirm })
            }}>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">Current Password</label>
                <input type="password" name="current" required className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] transition" />
              </div>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">New Password</label>
                <input type="password" name="newPassword" required className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] transition" />
              </div>
              <div className="mb-3">
                <label className="block text-gray-400 text-xs mb-1">Confirm New Password</label>
                <input type="password" name="confirm" required className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] transition" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition">Update Password</button>
            </form>
          </SettingsCard>

          <SettingsCard title="Two-Factor Authentication" icon="bi-shield-lock">
            {settings.TOTPEnabled ? (
              <div>
                <p className="text-emerald-400 text-sm mb-3"><i className="bi bi-check-circle mr-1"></i> 2FA is enabled</p>
                <button
                  onClick={() => handleSubmit('/api/settings/disable-2fa', {})}
                  className="w-full py-2.5 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition"
                >
                  Disable 2FA
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-3">Add extra security to your account.</p>
                <button
                  onClick={() => window.location.href = '/settings/enable-2fa'}
                  className="w-full py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition"
                >
                  Enable 2FA
                </button>
              </div>
            )}
          </SettingsCard>
        </div>
      )}
    </div>
  )
}

function SettingsCard({ title, icon, children }) {
  return (
    <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-6">
      <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
        <i className={`bi ${icon} text-[#FFE148]`}></i> {title}
      </h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value, highlight, mono }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#2A2E35]/50 last:border-0">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-[#FFE148]' : 'text-white'} ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}