// File: client/src/pages/VehicleDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function VehicleDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/vehicles/${id}`)
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    )
  }

  if (!data || !data.vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-3xl p-10 shadow-lg">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1A1F2A] flex items-center justify-center">
            <i className="bi bi-exclamation-triangle text-5xl text-red-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Vehicle Not Found</h3>
          <p className="text-gray-400 mb-6">This vehicle does not exist or you do not have access.</p>
          <Link to="/vehicles" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition">
            <i className="bi bi-arrow-left"></i> Back to Vehicles
          </Link>
        </div>
      </div>
    )
  }

  const { vehicle, trunk = [] } = data

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <Link to="/vehicles" className="inline-flex items-center text-[#FFE148] hover:underline text-sm mb-6 group">
        <i className="bi bi-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 
        Back to Vehicles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Gambar & Informasi Utama */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#13171F] border border-[#2A2E35] rounded-3xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-[#1A1F2A] to-[#0A0C10] flex items-center justify-center p-4 relative">
              <img
                src={`https://weedarr.wdfiles.com/local--files/veh/${vehicle.vehModel}.png`}
                alt={vehicle.vehicleName}
                className="max-h-full object-contain drop-shadow-2xl"
                onError={(e) => { e.target.src = 'https://weedarr.wdfiles.com/local--files/veh/400.png' }}
              />
            </div>
            <div className="p-5">
              <h1 className="text-2xl font-bold text-white mb-2">{vehicle.vehicleName}</h1>
              <p className="text-gray-400 text-sm">Model {vehicle.vehModel} · Plate: <span className="text-[#FFE148] font-mono font-medium">{vehicle.vehPlate}</span></p>
              <p className="text-gray-400 text-sm mt-1">Owner: <span className="text-white font-medium">{vehicle.owner_name}</span></p>
              <div className="mt-4 flex gap-3">
                <div className="bg-[#0A0C10] rounded-xl p-3 flex-1 text-center">
                  <span className="text-gray-500 text-xs block">Health</span>
                  <span className="text-white font-bold text-lg">{vehicle.vehHealth_num}%</span>
                  <div className="w-full bg-[#1A1F2A] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vehicle.vehHealth_num}%` }} />
                  </div>
                </div>
                <div className="bg-[#0A0C10] rounded-xl p-3 flex-1 text-center">
                  <span className="text-gray-500 text-xs block">Fuel</span>
                  <span className="text-white font-bold text-lg">{vehicle.vehFuel_num}%</span>
                  <div className="w-full bg-[#1A1F2A] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-[#FFE148] rounded-full" style={{ width: `${vehicle.vehFuel_num}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Lengkap + Trunk */}
        <div className="lg:col-span-2 space-y-6">
          {/* Specifications */}
          <SectionCard title="Specifications" icon="bi-info-circle">
            <div className="grid grid-cols-2 gap-3 p-4">
              <InfoRow label="Color 1" value={`#${vehicle.vehColor1_hex}`} color={`#${vehicle.vehColor1_hex}`} />
              <InfoRow label="Color 2" value={`#${vehicle.vehColor2_hex}`} color={`#${vehicle.vehColor2_hex}`} />
              <InfoRow label="Locked" value={vehicle.vehLocked ? 'Locked' : 'Unlocked'} />
              <InfoRow label="Insurance" value={vehicle.vehInsurance ? 'Active' : 'None'} highlight={vehicle.vehInsurance} />
              <InfoRow label="Claimable" value={vehicle.vehClaimable ? 'Yes' : 'No'} />
              <InfoRow label="Rental" value={vehicle.vehRental ? 'Yes' : 'No'} />
            </div>
          </SectionCard>

          {/* Condition */}
          <SectionCard title="Condition" icon="bi-speedometer2">
            <div className="space-y-4 p-4">
              <ProgressBar label="Health" value={vehicle.vehHealth_num} color="bg-emerald-500" />
              <ProgressBar label="Fuel" value={vehicle.vehFuel_num} color="bg-[#FFE148]" />
              <ProgressBar label="Panel Damage" value={vehicle.vehPanelDamage || 0} color="bg-orange-500" />
              <ProgressBar label="Door Damage" value={vehicle.vehDoorDamage || 0} color="bg-orange-500" />
              <ProgressBar label="Light Damage" value={vehicle.vehLightDamage || 0} color="bg-yellow-500" />
              <ProgressBar label="Tire Damage" value={vehicle.vehTireDamage || 0} color="bg-yellow-500" />
            </div>
          </SectionCard>

          {/* Location */}
          <SectionCard title="Location" icon="bi-geo-alt">
            <div className="grid grid-cols-3 gap-3 p-4">
              <InfoRow label="X" value={vehicle.vehX_parsed} mono />
              <InfoRow label="Y" value={vehicle.vehY_parsed} mono />
              <InfoRow label="Z" value={vehicle.vehZ_parsed} mono />
              <InfoRow label="Angle" value={`${vehicle.vehA_parsed}°`} />
              <InfoRow label="World" value={vehicle.vehWorld} />
              <InfoRow label="Interior" value={vehicle.vehInterior} />
            </div>
          </SectionCard>

          {/* Trunk Inventory */}
          <SectionCard title="Trunk Inventory" icon="bi-box" count={trunk.length}>
            {trunk.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#2A2E35]">
                      <th className="py-3 px-4 text-left font-medium">Slot</th>
                      <th className="py-3 px-4 text-left font-medium">Item</th>
                      <th className="py-3 px-4 text-left font-medium">Qty</th>
                      {trunk.some(t => t.weaponID) && <th className="py-3 px-4 text-left font-medium">Weapon Details</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {trunk.map((item) => (
                      <tr key={item.ID} className="border-b border-[#2A2E35]/50 hover:bg-white/5 transition">
                        <td className="py-3 px-4 text-white font-medium">{item.slot}</td>
                        <td className="py-3 px-4 text-white">{item.itemName || 'Empty Slot'}</td>
                        <td className="py-3 px-4 text-right text-white font-semibold">{item.itemQuantity || '-'}</td>
                        {trunk.some(t => t.weaponID) && (
                          <td className="py-3 px-4 text-gray-400 text-xs">
                            {item.weaponID ? `Weapon ${item.weaponID} · Ammo ${item.weaponAmmo} · Durability ${item.weaponDurability}%` : '-'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="Trunk is empty." />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, icon, count, children }) {
  return (
    <div className="bg-[#13171F] border border-[#2A2E35] rounded-3xl overflow-hidden shadow-md hover:border-[#FFE148]/40 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2E35]">
        <h3 className="text-white font-semibold flex items-center gap-2 text-base">
          <i className={`bi ${icon} text-[#FFE148]`}></i> {title}
        </h3>
        {count !== undefined && (
          <span className="px-3 py-1 bg-[#0A0C10] rounded-full text-gray-400 text-xs font-medium">{count} items</span>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

function InfoRow({ label, value, color, highlight, mono }) {
  return (
    <div className="flex justify-between items-center py-2 px-1">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-emerald-400' : 'text-white'} ${mono ? 'font-mono' : ''}`}>
        {color && (
          <span className="w-3 h-3 rounded-full inline-block mr-2 border border-gray-500" style={{ backgroundColor: color }}></span>
        )}
        {value}
      </span>
    </div>
  )
}

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}%</span>
      </div>
      <div className="w-full bg-[#1A1F2A] h-2.5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-10">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#1A1F2A] flex items-center justify-center">
        <i className="bi bi-inbox text-2xl text-gray-500"></i>
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}