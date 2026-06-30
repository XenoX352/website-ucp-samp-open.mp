import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function HouseDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/houses/${id}`)
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

  if (!data || !data.house) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-10">
          <i className="bi bi-exclamation-triangle text-5xl text-gray-500 mb-4 block" />
          <h3 className="text-xl font-semibold text-white mb-2">House Not Found</h3>
          <p className="text-gray-400 mb-6">This house does not exist or you do not have access.</p>
          <Link to="/houses" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition">
            <i className="bi bi-arrow-left"></i> Back to Houses
          </Link>
        </div>
      </div>
    )
  }

  const { house, members = [], inventory = [], vehicles = [] } = data

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <Link to="/houses" className="inline-flex items-center text-[#FFE148] hover:underline text-sm mb-6 group">
        <i className="bi bi-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 
        Back to Houses
      </Link>

      <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 bg-gradient-to-br from-[#0A0C10] to-[#1A1F2A] flex items-center justify-center p-10 relative overflow-hidden">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${house.houseLocked ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
                {house.houseLocked ? 'Locked' : 'Open'}
              </span>
              <span className="px-3 py-1.5 bg-[#FFE148] text-[#0A0C10] text-xs font-bold rounded-full shadow-lg">
                Level {house.houseLevel}
              </span>
            </div>
            <i className="bi bi-house-fill text-[120px] text-[#2A2E35] opacity-50" />
          </div>

          <div className="lg:w-3/5 p-6 lg:p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">
              {house.houseAddress || 'No Address'}
            </h1>
            <p className="text-gray-400 text-sm mb-6">Owner: <span className="text-white font-medium">{house.houseOwnerName}</span></p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <InfoBlock label="Price" value={`$${house.housePrice.toLocaleString()}`} />
              <InfoBlock label="Vault" value={`$${house.houseVault.toLocaleString()}`} highlight />
              <InfoBlock label="Tax Due" value={`$${house.houseTaxDue.toLocaleString()}`} />
              <InfoBlock label="Interior" value={`#${house.houseInterior}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Inventory" icon="bi-box" count={inventory.length}>
            {inventory.length > 0 ? (
              <TableMini headers={['Item', 'Model', 'Qty']}>
                {inventory.map((item, i) => (
                  <tr key={i} className="border-b border-[#2A2E35]/50 hover:bg-white/5 transition">
                    <td className="py-2.5 px-3 text-white text-sm">{item.itemName}</td>
                    <td className="py-2.5 px-3 text-gray-400 text-sm">{item.itemModel}</td>
                    <td className="py-2.5 px-3 text-right text-white font-semibold text-sm">{item.itemQuantity}</td>
                  </tr>
                ))}
              </TableMini>
            ) : <EmptyState message="No items in house inventory." />}
          </SectionCard>

          <SectionCard title="Garage Vehicles" icon="bi-car-front" count={vehicles.length}>
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                {vehicles.map((veh, i) => (
                  <div key={i} className="bg-[#0A0C10] p-4 rounded-xl">
                    <p className="text-white font-bold text-lg">Model {veh.vehicleModel}</p>
                    <p className="text-gray-400 text-sm">Plate: <span className="text-[#FFE148] font-mono">{veh.plate}</span></p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${veh.inGarage ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {veh.inGarage ? 'Inside' : 'Outside'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="No vehicles in garage." />}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Members" icon="bi-people" count={members.length}>
            {members.length > 0 ? (
              <div className="space-y-2 p-3">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0A0C10] p-3 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-[#FFE148] flex items-center justify-center text-[#0A0C10] font-bold text-sm">
                      {m.Name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{m.Name}</p>
                      <p className="text-gray-500 text-xs">ID: {m.pID}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState message="No additional members." />}
          </SectionCard>

          <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-gray-300 text-sm hover:border-[#FFE148] hover:text-[#FFE148] transition">
                <i className="bi bi-gear mr-2"></i> Manage House
              </button>
              <button className="w-full py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-gray-300 text-sm hover:border-[#FFE148] hover:text-[#FFE148] transition">
                <i className="bi bi-cash mr-2"></i> Pay Tax
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value, highlight }) {
  return (
    <div className="bg-[#0A0C10] rounded-xl p-4 text-center">
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-[#FFE148]' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function SectionCard({ title, icon, count, children }) {
  return (
    <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2E35]">
        <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
          <i className={`bi ${icon} text-[#FFE148]`}></i> {title}
        </h3>
        {count > 0 && <span className="text-gray-500 text-xs">{count} items</span>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function TableMini({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-[#2A2E35]">
            {headers.map((h, i) => (
              <th key={i} className={`py-2.5 px-3 font-medium ${i === headers.length - 1 ? 'text-right' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-8">
      <i className="bi bi-inbox text-3xl text-gray-600 mb-2 block" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}