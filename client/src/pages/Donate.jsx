import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Donate() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [amount, setAmount] = useState(50000)
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [proofFile, setProofFile] = useState(null)
  const [testimoniText, setTestimoniText] = useState('')
  const [testimoniDonationId, setTestimoniDonationId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyDonationId, setReplyDonationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const isAdmin = user?.AdminLevel > 0

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/donate')
      setDonations(res.data.donations || [])
      setTestimonials(res.data.testimonials || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchData() }, [])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleDonate = async (e) => {
    e.preventDefault()
    if (!proofFile) return showMessage('error', 'Please upload payment proof')
    setLoading(true)
    const formData = new FormData()
    formData.append('amount', amount)
    formData.append('payment_method', paymentMethod)
    formData.append('proof', proofFile)
    try {
      const res = await axios.post('/api/donate/submit', formData)
      showMessage('success', res.data.message)
      setProofFile(null)
      fetchData()
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTestimoni = async (donationId) => {
    if (testimoniText.length < 10) return showMessage('error', 'Testimoni must be at least 10 characters')
    try {
      const res = await axios.post(`/api/donate/testimoni/${donationId}`, { testimoni: testimoniText })
      showMessage('success', res.data.message)
      setTestimoniText('')
      setTestimoniDonationId(null)
      fetchData()
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to post testimoni')
    }
  }

  const handleReply = async (donationId) => {
    if (replyText.length < 5) return showMessage('error', 'Reply must be at least 5 characters')
    try {
      const res = await axios.post(`/api/donate/reply/${donationId}`, { reply: replyText })
      showMessage('success', res.data.message)
      setReplyText('')
      setReplyDonationId(null)
      fetchData()
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to reply')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <i className="bi bi-heart text-[#FFE148]"></i> Support Morch Community
        </h2>
        <p className="text-gray-400 text-sm mt-1">Your donation helps us keep the server running. All donations are voluntary and non-refundable.</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Donation Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { amount: 50000, label: 'Bronze', color: 'border-[#CD7F32] text-[#CD7F32]' },
          { amount: 150000, label: 'Silver', color: 'border-[#C0C0C0] text-[#C0C0C0]' },
          { amount: 300000, label: 'Gold', color: 'border-[#FFE148] text-[#FFE148]' },
        ].map(pkg => (
          <button
            key={pkg.label}
            onClick={() => setAmount(pkg.amount)}
            className={`p-5 rounded-2xl border-2 bg-[#13171F] hover:bg-[#1A1F2A] transition-all duration-300 ${
              amount === pkg.amount ? `${pkg.color} shadow-lg` : 'border-[#2A2E35] text-gray-400'
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{pkg.label}</h3>
            <p className="text-2xl font-black">Rp {pkg.amount.toLocaleString()}</p>
          </button>
        ))}
      </div>

      {/* Donation Form */}
      <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-lg mb-4">Submit Donation</h3>
        <form onSubmit={handleDonate} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-1">Amount (Rp)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148]"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148]"
              >
                <option value="qris">QRIS</option>
                <option value="dana">Dana</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Payment Proof Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofFile(e.target.files[0])}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FFE148] file:text-[#0A0C10] hover:file:bg-[#E6CA3E]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, PNG, or GIF.</p>
          </div>
          <div className="bg-[#0A0C10] rounded-xl p-4 text-sm text-gray-400">
            <strong className="text-[#FFE148]">Disclaimer:</strong> Donations are voluntary and non-refundable. They are used to support server maintenance and development. No in-game advantages are given in exchange for donations.
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg hover:bg-[#E6CA3E] disabled:opacity-60 transition">
            {loading ? 'Submitting...' : 'Submit Donation'}
          </button>
        </form>
      </div>

      {/* My Donations & Testimoni */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-lg mb-4">My Donations</h3>
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d.id} className="bg-[#13171F] border border-[#2A2E35] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">Rp {d.amount.toLocaleString()} via {d.payment_method || 'QRIS'}</p>
                  <p className="text-gray-500 text-xs">{new Date(d.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  d.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {d.status}
                </span>
              </div>
              {d.status === 'completed' && !d.testimoni && (
                <div className="mt-3">
                  {testimoniDonationId === d.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testimoniText}
                        onChange={(e) => setTestimoniText(e.target.value)}
                        placeholder="Write your testimoni (min 10 chars)..."
                        className="flex-1 px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white text-sm outline-none focus:border-[#FFE148]"
                      />
                      <button onClick={() => handleTestimoni(d.id)} className="px-4 py-2 bg-[#FFE148] text-[#0A0C10] text-sm font-semibold rounded-lg">Send</button>
                      <button onClick={() => setTestimoniDonationId(null)} className="px-3 py-2 text-gray-400 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setTestimoniDonationId(d.id)} className="mt-2 text-[#FFE148] text-sm hover:underline">
                      Write Testimoni
                    </button>
                  )}
                </div>
              )}
              {d.testimoni && (
                <div className="mt-2 p-3 bg-[#0A0C10] rounded-lg">
                  <p className="text-gray-300 text-sm italic">"{d.testimoni}"</p>
                  {d.admin_reply && (
                    <div className="mt-2 pl-3 border-l-2 border-[#FFE148]">
                      <p className="text-[#FFE148] text-xs font-medium">Admin Reply:</p>
                      <p className="text-gray-400 text-xs">{d.admin_reply}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Public Testimonials */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-lg mb-4">Community Testimonials</h3>
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className="bg-[#13171F] border border-[#2A2E35] rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium text-sm">{t.user_ucp}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(t.testimoni_created_at).toLocaleDateString()} · Rp {t.amount.toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm mt-2 italic">"{t.testimoni}"</p>
                  {t.admin_reply && (
                    <div className="mt-2 pl-3 border-l-2 border-[#FFE148]">
                      <p className="text-[#FFE148] text-xs font-medium">Admin Reply:</p>
                      <p className="text-gray-400 text-xs">{t.admin_reply}</p>
                    </div>
                  )}
                </div>
              </div>
              {isAdmin && !t.admin_reply && (
                <div className="mt-3">
                  {replyDonationId === t.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white text-sm outline-none"
                      />
                      <button onClick={() => handleReply(t.id)} className="px-4 py-2 bg-[#FFE148] text-[#0A0C10] text-sm font-semibold rounded-lg">Reply</button>
                      <button onClick={() => setReplyDonationId(null)} className="px-3 py-2 text-gray-400 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setReplyDonationId(t.id)} className="mt-2 text-[#FFE148] text-sm hover:underline">
                      <i className="bi bi-reply mr-1"></i> Reply as Admin
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="bg-[#0A0C10] rounded-xl p-4 text-center text-gray-500 text-xs">
        <p>
          <strong className="text-[#FFE148]">Note:</strong> All donations are final and non-refundable. 
          Please ensure you have read the server rules before donating. 
          For any issues, contact us on <a href="https://discord.gg/morchcommunity" className="text-[#FFE148] underline">Discord</a>.
        </p>
      </div>
    </div>
  )
}