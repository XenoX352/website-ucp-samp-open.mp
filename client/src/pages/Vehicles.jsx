
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/vehicles')
      .then(res => setVehicles(res.data.vehicles || []))
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">My Vehicles</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your owned vehicles.</p>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-24 bg-[#13171F] border border-[#2A2E35] rounded-3xl shadow-lg">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1A1F2A] flex items-center justify-center">
            <i className="bi bi-car-front text-5xl text-gray-500"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Vehicles Yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto">Purchase a vehicle in-game to manage it here and use its trunk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {vehicles.map(veh => (
            <Link
              key={veh.vehID}
              to={`/vehicles/${veh.vehID}`}
              className="group bg-[#13171F] border border-[#2A2E35] rounded-2xl overflow-hidden hover:border-[#FFE148] transition-all duration-300 hover:shadow-xl hover:shadow-[#FFE148]/5 transform hover:-translate-y-1"
            >
              <div className="aspect-video bg-gradient-to-br from-[#1A1F2A] to-[#0A0C10] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#FFE148] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                <img
                  src={`https://weedarr.wdfiles.com/local--files/veh/${veh.vehModel}.png`}
                  alt={`Model ${veh.vehModel}`}
                  className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://weedarr.wdfiles.com/local--files/veh/400.png' }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {veh.vehInsurance ? (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">Insured</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">No Insurance</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-lg truncate mb-1">Model {veh.vehModel}</h3>
                <p className="text-gray-400 text-sm">Plate: <span className="text-[#FFE148] font-mono font-medium">{veh.vehPlate}</span></p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-[#0A0C10] rounded-lg p-2 text-center">
                    <span className="text-gray-500 text-xs">Health</span>
                    <div className="w-full bg-[#1A1F2A] h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${veh.vehHealth}%` }} />
                    </div>
                    <span className="text-white text-xs mt-0.5 block">{Math.round(veh.vehHealth)}%</span>
                  </div>
                  <div className="bg-[#0A0C10] rounded-lg p-2 text-center">
                    <span className="text-gray-500 text-xs">Fuel</span>
                    <div className="w-full bg-[#1A1F2A] h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#FFE148] rounded-full" style={{ width: `${veh.vehFuel}%` }} />
                    </div>
                    <span className="text-white text-xs mt-0.5 block">{Math.round(veh.vehFuel)}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}