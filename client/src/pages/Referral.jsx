import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Referral() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redeemLoading, setRedeemLoading] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    axios.get('/api/referral')
      .then(res => setData(res.data))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load referral data.' }))
      .finally(() => setLoading(false))
  }, [])

  const handleRedeem = async (itemId) => {
    setRedeemLoading(itemId)
    try {
      const res = await axios.post(`/api/referral/redeem/${itemId}`)
      setMessage({ type: 'success', text: res.data.message || 'Reward redeemed!' })
      const updated = await axios.get('/api/referral')
      setData(updated.data)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Redemption failed.' })
    } finally {
      setRedeemLoading(null)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-10">
          <i className="bi bi-exclamation-triangle text-5xl text-gray-500 mb-4 block" />
          <h3 className="text-xl font-semibold text-white mb-2">Unable to Load</h3>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    )
  }

  const { user, invited, rewards, shopItems, invitedCount, nextMilestone } = data

  const milestones = [
    { count: 1, mgold: 60, label: '1 invite' },
    { count: 5, mgold: 340, label: '5 invites' },
    { count: 30, mgold: 670, label: '30 invites' },
    { count: 100, mgold: 1200, label: '100 invites' },
  ]

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referral_code || '')
      .then(() => setMessage({ type: 'success', text: 'Referral code copied!' }))
      .catch(() => setMessage({ type: 'error', text: 'Failed to copy code.' }))
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-link-45deg text-[#FFE148]"></i> Referral Program
        </h2>
        <p className="text-gray-400 text-sm mt-1">Invite friends and earn mgold. Exchange mgold for in‑game rewards.</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon="bi-wallet2" label="Your mgold Balance" value={user?.mgold || 0} highlight />
        <StatCard icon="bi-people-fill" label="Friends Invited" value={invitedCount} />
        <StatCard icon="bi-flag-fill" label="Next Milestone" value={nextMilestone ? `${nextMilestone} invites` : 'Max reached!'} />
      </div>

      <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-5 sm:p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-2">Your Referral Code</h3>
        <p className="text-gray-400 text-sm mb-4">Share this code with friends. They'll enter it when registering.</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <code className="flex-1 bg-[#0A0C10] border border-[#2A2E35] rounded-lg px-5 py-3 text-[#FFE148] font-mono text-xl tracking-wider text-center select-all">
            {user?.referral_code || 'N/A'}
          </code>
          <button onClick={copyCode} className="px-6 py-3 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition active:scale-95">
            Copy Code
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-3">
          Or share link: <span className="text-gray-300">http://localhost:3001/register?ref={user?.referral_code}</span>
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <i className="bi bi-trophy text-[#FFE148]"></i> Milestone Rewards
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.map(m => {
            const achieved = invitedCount >= m.count
            return (
              <div key={m.count} className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                achieved ? 'bg-[#FFE148] text-[#0A0C10] shadow-lg shadow-[#FFE148]/20' : 'bg-[#13171F] border border-[#2A2E35] text-white'
              }`}>
                {achieved && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </span>
                )}
                <p className="text-2xl font-bold">{m.mgold}</p>
                <p className={`text-xs mt-1 ${achieved ? 'text-[#0A0C10]/70' : 'text-gray-400'}`}>mgold</p>
                <p className={`text-sm font-medium mt-2 ${achieved ? 'text-[#0A0C10]' : 'text-gray-300'}`}>{m.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <i className="bi bi-shop text-[#FFE148]"></i> mgold Shop
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems?.map(item => {
            const canAfford = (user?.mgold || 0) >= item.mgold_price
            return (
              <div key={item.id} className="bg-[#13171F] border border-[#2A2E35] rounded-xl p-5 flex flex-col hover:border-[#FFE148] transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-semibold text-sm">{item.item_name}</h4>
                  <span className="px-2 py-1 bg-[#0A0C10] rounded-lg text-xs text-gray-400 uppercase">
                    {item.item_type}
                  </span>
                </div>
                <p className="text-[#FFE148] text-2xl font-bold mb-1">{item.mgold_price}</p>
                <p className="text-gray-500 text-xs mb-4">mgold</p>
                {item.stock !== -1 && item.stock <= 5 && item.stock > 0 && (
                  <p className="text-orange-400 text-xs mb-2">Only {item.stock} left!</p>
                )}
                <button
                  onClick={() => handleRedeem(item.id)}
                  disabled={!canAfford || redeemLoading === item.id}
                  className={`mt-auto w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    canAfford
                      ? redeemLoading === item.id
                        ? 'bg-[#8A7A3A] text-[#0A0C10] cursor-wait'
                        : 'bg-[#FFE148] text-[#0A0C10] hover:bg-[#E6CA3E] active:scale-95'
                      : 'bg-[#2A2E35] text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {redeemLoading === item.id ? 'Redeeming...' : 'Redeem'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-5">
          <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
            <i className="bi bi-people text-[#FFE148]"></i> Invited Friends
            <span className="text-sm font-normal text-gray-400 ml-1">({invitedCount})</span>
          </h3>
          {invited?.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {invited.map((u) => (
                <div key={u.ID} className="flex items-center justify-between bg-[#0A0C10] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2A2E35] flex items-center justify-center text-white font-bold text-xs">
                      {u.UCP.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">{u.UCP}</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(u.RegisterDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <i className="bi bi-people text-4xl text-gray-600 mb-2 block" />
              <p className="text-gray-500 text-sm">You haven't invited anyone yet.</p>
              <p className="text-gray-600 text-xs mt-1">Share your referral code to get started!</p>
            </div>
          )}
        </div>

        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-5">
          <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
            <i className="bi bi-clock-history text-[#FFE148]"></i> Recent Rewards
          </h3>
          {rewards?.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {rewards.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-[#0A0C10] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFE148]/20 flex items-center justify-center text-[#FFE148] font-bold text-sm">
                      <i className="bi bi-gift"></i>
                    </div>
                    <div>
                      <p className="text-[#FFE148] text-sm font-semibold">+{r.mgold_earned} mgold</p>
                      <p className="text-gray-500 text-xs">Referral reward</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <i className="bi bi-clock-history text-4xl text-gray-600 mb-2 block" />
              <p className="text-gray-500 text-sm">No rewards earned yet.</p>
              <p className="text-gray-600 text-xs mt-1">Invite friends to start earning mgold!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, highlight }) {
  return (
    <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-5 text-center">
      <i className={`bi ${icon} text-2xl mb-2 block ${highlight ? 'text-[#FFE148]' : 'text-gray-400'}`} />
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${highlight ? 'text-[#FFE148]' : 'text-white'}`}>{value}</p>
    </div>
  )
}