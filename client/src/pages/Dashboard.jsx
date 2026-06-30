import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const factionList = [
  { id: 1, name: 'SAGOV', color: '#3B82F6' },
  { id: 2, name: 'SAPD', color: '#EF4444' },
  { id: 3, name: 'SAMD', color: '#F59E0B' },
  { id: 4, name: 'SANEWS', color: '#8B5CF6' },
  { id: 5, name: 'SAFD', color: '#EF4444' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onlinePlayers, setOnlinePlayers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, onlineRes] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/dashboard/online'),
        ])
        setData(statsRes.data)
        setOnlinePlayers(onlineRes.data.online ?? 0)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    )
  }

  if (!data) return null

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Online Players',
        data: [120, 145, 132, 167, 189, 210, 195],
        backgroundColor: '#FFE148',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#13171F',
        titleColor: '#FFE148',
        bodyColor: '#E6E9F0',
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6B7280' } },
      y: { grid: { color: '#2A2E35' }, ticks: { color: '#6B7280' }, beginAtZero: true },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0C10] to-[#1A1F2A]">
      {/* Hero Section dengan Background Gradient dan Logo Open.MP */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1F2A] via-[#0F1318] to-[#0A0C10] border-b border-[#2A2E35]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFE148]/10 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE148]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFE148]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src="/images/logo.png" alt="Morch" className="w-14 h-14 rounded-2xl" />
            <span className="text-3xl font-bold text-[#FFE148]">×</span>
            <img src="https://open.mp/images/assets/logo-light-trans.svg" alt="Open.MP" className="w-14 h-14" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 animate__animated animate__fadeInDown">
            Welcome back, <span className="text-[#FFE148]">{user?.UCP || 'Player'}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 animate__animated animate__fadeInUp">
            The streetz are waiting for you. Hop in and join the other{' '}
            <span className="text-[#FFE148] font-semibold">{onlinePlayers || 0}</span> players online.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate__animated animate__fadeInUp">
            <a
              href="samp://play.morchcommunity.com:7777"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FFE148] text-[#0A0C10] font-bold rounded-full hover:bg-[#E6CA3E] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#FFE148]/20"
            >
              <i className="bi bi-play-fill text-xl"></i>
              Play Now
              <span className="hidden sm:inline ml-1">(PC Only)</span>
            </a>
            <a
              href="https://www.sa-mp.com/download.php"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[#2A2E35] text-white font-semibold rounded-full hover:border-[#FFE148] hover:text-[#FFE148] transition-all duration-300 hover:scale-105"
            >
              <img src="/images/samp.jpg" alt="SA-MP" className="w-6 h-6 rounded" />
              Get SA:MP
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Server Stats */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider">Statistics</h2>
              {[
                { icon: 'bi-people-fill', label: 'Registered UCP', value: data.totalUCP },
                { icon: 'bi-person-badge', label: 'Characters', value: data.totalCharacters },
                { icon: 'bi-car-front-fill', label: 'Vehicles', value: data.totalVehicles },
                { icon: 'bi-house-door-fill', label: 'Houses', value: data.totalHouses },
                { icon: 'bi-shop-window', label: 'Businesses', value: data.totalBusinesses },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#13171F]/80 backdrop-blur-sm border border-[#2A2E35] rounded-xl p-4 hover:border-[#FFE148]/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFE148]/10 rounded-full flex items-center justify-center">
                      <i className={`${stat.icon} text-[#FFE148]`}></i>
                    </div>
                    <span className="text-gray-300 text-sm">{stat.label}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{stat.value?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Discord Card */}
            <div>
              <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-3">Discord</h2>
              <a
                href="https://discord.gg/morchcommunity"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 bg-[#404EED] hover:bg-[#3540D3] rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#404EED]/20"
              >
                <img src="/images/discord.svg" alt="Discord" className="w-12 h-12" />
                <span className="text-white font-semibold">Join our Discord Server</span>
              </a>
            </div>

            {/* Factions - Desain Baru dengan Progress Bar */}
            <div>
              <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-3">Registered Factions</h2>
              <div className="space-y-3">
                {factionList.map((faction) => {
                  const count = data.factionCounts?.[faction.id] || 0
                  const maxCount = Math.max(...Object.values(data.factionCounts || {}), 1)
                  const percentage = (count / maxCount) * 100
                  return (
                    <div
                      key={faction.id}
                      className="bg-[#13171F]/80 backdrop-blur-sm border border-[#2A2E35] rounded-xl p-4 hover:border-[#FFE148]/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: faction.color }}
                          />
                          <span className="text-gray-300 text-sm font-medium">{faction.name}</span>
                        </div>
                        <span className="text-white font-bold text-sm">{count}</span>
                      </div>
                      <div className="w-full h-2 bg-[#2A2E35] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: faction.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Announcements */}
            <div>
              <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Announcements
              </h2>
              <div className="bg-[#13171F]/80 backdrop-blur-sm border border-[#2A2E35] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2A2E35] text-left">
                      <th className="py-3 px-4 text-gray-400 font-medium">Title</th>
                      <th className="py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Author</th>
                      <th className="py-3 px-4 text-gray-400 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2E35]">
                    {data.announcements?.length > 0 ? (
                      data.announcements.map((ann) => (
                        <tr key={ann.id} className="hover:bg-[#1A1F2A]/50 transition">
                          <td className="py-3 px-4 text-white font-medium">{ann.title}</td>
                          <td className="py-3 px-4 text-gray-400 hidden sm:table-cell">{ann.author}</td>
                          <td className="py-3 px-4 text-gray-500 text-xs text-right whitespace-nowrap">
                            {new Date(ann.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          No announcements yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Updates */}
            <div>
              <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Server Updates
              </h2>
              <div className="space-y-2">
                {data.updates?.length > 0 ? (
                  data.updates.map((update) => (
                    <div
                      key={update.id}
                      className="bg-[#13171F]/80 backdrop-blur-sm border border-[#2A2E35] rounded-xl p-4 hover:border-[#FFE148]/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium text-sm">{update.title}</h3>
                            <span className="text-xs text-gray-500 bg-[#0A0C10] px-2 py-0.5 rounded-full">
                              {update.category}
                            </span>
                          </div>
                          {update.description && (
                            <p
                              className="text-gray-400 text-xs mt-2"
                              dangerouslySetInnerHTML={{ __html: update.description }}
                            />
                          )}
                        </div>
                        <span className="text-gray-500 text-xs whitespace-nowrap">
                          {new Date(update.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#13171F]/80 backdrop-blur-sm border border-[#2A2E35] rounded-xl p-6 text-center">
                    <p className="text-gray-500 text-sm">No updates available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Player Count Chart */}
            <div>
              <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Player Count History
              </h2>
              <div className="bg-[#13171F]/80 backdrop-blur-sm border border-[#2A2E35] rounded-xl p-6">
                <div className="h-64">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2A2E35] mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; 2025-2026 Morch Community. Built with{' '}
            <span className="text-[#FFE148]"></span> by XenoX.
          </p>
        </div>
      </div>
    </div>
  )
}