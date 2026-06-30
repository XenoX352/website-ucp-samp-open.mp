import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Houses() {
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/houses')
      .then(res => setHouses(res.data.houses || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Houses</h2>
          <p className="text-gray-400 text-sm mt-1">Select a house to view full details.</p>
        </div>
      </div>

      {houses.length === 0 ? (
        <div className="text-center py-20 bg-[#13171F] border border-[#2A2E35] rounded-2xl">
          <i className="bi bi-house-door text-6xl text-gray-600 mb-4 block" />
          <h3 className="text-xl font-semibold text-white mb-2">No Houses Yet</h3>
          <p className="text-gray-400">Purchase a house in-game to manage it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {houses.map(house => (
            <Link
              key={house.houseID}
              to={`/houses/${house.houseID}`}
              className="group bg-[#13171F] border border-[#2A2E35] rounded-2xl overflow-hidden hover:border-[#FFE148] transition-all duration-300 hover:shadow-xl hover:shadow-[#FFE148]/5"
            >
              <div className="aspect-video bg-gradient-to-br from-[#1A1F2A] to-[#0A0C10] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#FFE148] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                <i className="bi bi-house-fill text-6xl text-[#2A2E35] group-hover:text-[#FFE148]/20 transition-colors duration-500" />
                <div className="absolute bottom-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${house.houseLocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {house.houseLocked ? 'Locked' : 'Open'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg truncate mb-1">{house.houseAddress || 'No Address'}</h3>
                <p className="text-gray-400 text-sm mb-3">Owner: {house.houseOwnerName}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#0A0C10] rounded-lg p-2.5 text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Vault</p>
                    <p className="text-[#FFE148] font-bold">${house.houseVault.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0A0C10] rounded-lg p-2.5 text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Level</p>
                    <p className="text-white font-bold">{house.houseLevel}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-[#FFE148] text-sm font-medium group-hover:translate-x-1 transition-transform">
                  View Details <i className="bi bi-arrow-right ml-1.5"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}