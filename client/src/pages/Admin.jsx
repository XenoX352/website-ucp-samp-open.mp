import { useState, useEffect } from 'react'
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function AdminSidebar() {
  const location = useLocation()
  const links = [
    { path: '/admin', label: 'Overview', icon: 'bi-speedometer2' },
    { path: '/admin/ucp', label: 'UCP Accounts', icon: 'bi-people' },
    { path: '/admin/characters', label: 'Characters', icon: 'bi-person-badge' },
    { path: '/admin/vehicles', label: 'Vehicles', icon: 'bi-car-front' },
    { path: '/admin/houses', label: 'Houses', icon: 'bi-house-door' },
    { path: '/admin/businesses', label: 'Businesses', icon: 'bi-shop' },
    { path: '/admin/donations', label: 'Donations', icon: 'bi-heart' },
    { path: '/admin/logs', label: 'Logs', icon: 'bi-journal' },
    { path: '/admin/bans', label: 'Bans', icon: 'bi-shield-x' },
    { path: '/admin/announcements', label: 'Announcements', icon: 'bi-megaphone' },
  ]

  return (
    <div className="w-64 bg-[#13171F] border-r border-[#2A2E35] min-h-screen p-4 space-y-1 flex-shrink-0">
      <div className="text-[#FFE148] font-bold text-lg mb-6 px-3 flex items-center gap-2">
        <i className="bi bi-shield-fill-check"></i> Admin Panel
      </div>
      {links.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
            location.pathname === link.path ? 'bg-[#FFE148] text-[#0A0C10] font-semibold' : 'text-gray-400 hover:text-white hover:bg-[#1A1F2A]'
          }`}
        >
          <i className={`bi ${link.icon}`}></i> {link.label}
        </Link>
      ))}
      <div className="pt-4 mt-4 border-t border-[#2A2E35]">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1A1F2A] transition">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#13171F] border border-[#2A2E35] rounded-xl p-5 text-center hover:border-[#FFE148]/50 transition">
      <i className={`bi ${icon} text-2xl text-[#FFE148] mb-2 block`}></i>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-xs mt-1">{label}</p>
    </div>
  )
}

function Table({ headers, children }) {
  return (
    <div className="bg-[#13171F] border border-[#2A2E35] rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2E35] text-left">
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4 text-gray-400 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2A2E35]">
          {children}
        </tbody>
      </table>
    </div>
  )
}

function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
            page === i + 1 ? 'bg-[#FFE148] text-[#0A0C10]' : 'bg-[#13171F] border border-[#2A2E35] text-gray-400 hover:text-white'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function AdminOverview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get('/api/admin/stats').then(res => setStats(res.data)).catch(() => {})
  }, [])

  if (!stats) return <div className="p-6 text-gray-400">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Admin Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="bi-people-fill" label="UCP Accounts" value={stats.totalUCP} />
        <StatCard icon="bi-person-badge" label="Characters" value={stats.totalCharacters} />
        <StatCard icon="bi-car-front-fill" label="Vehicles" value={stats.totalVehicles} />
        <StatCard icon="bi-house-door-fill" label="Houses" value={stats.totalHouses} />
        <StatCard icon="bi-shop-window" label="Businesses" value={stats.totalBusinesses} />
        <StatCard icon="bi-shield-x" label="Bans" value={stats.totalBans} />
        <StatCard icon="bi-wifi" label="Online" value={stats.onlinePlayers} />
        <StatCard icon="bi-heart" label="Donations" value={stats.totalDonations} />
      </div>
    </div>
  )
}

function AdminUCP() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const limit = 15

  useEffect(() => {
    axios.get(`/api/admin/ucp?page=${page}&limit=${limit}`).then(res => {
      setData(res.data.data)
      setTotal(res.data.total)
    }).catch(() => {})
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this UCP?')) return
    await axios.delete(`/api/admin/ucp/${id}`)
    setData(data.filter(d => d.ID !== id))
  }

  const handleEdit = (item) => setEditItem(item)
  const handleSave = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.put(`/api/admin/ucp/${editItem.ID}`, form)
    setEditItem(null)
    setData(data.map(d => d.ID === editItem.ID ? { ...d, ...form } : d))
  }

  const filtered = data.filter(d => d.UCP?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">UCP Accounts</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none focus:border-[#FFE148] w-64"
        />
      </div>
      <Table headers={['ID', 'UCP', 'Email', 'Discord', 'Admin', 'Online', 'Registered', 'Actions']}>
        {filtered.map(u => (
          <tr key={u.ID} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{u.ID}</td>
            <td className="py-3 px-4 text-white">{u.UCP}</td>
            <td className="py-3 px-4 text-gray-400 text-xs">{u.email}</td>
            <td className="py-3 px-4 text-gray-400 text-xs">{u.discord_username || u.discordid}</td>
            <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs ${u.AdminLevel > 0 ? 'bg-[#FFE148]/20 text-[#FFE148]' : 'bg-gray-500/20 text-gray-400'}`}>{u.AdminLevel}</span></td>
            <td className="py-3 px-4"><span className={`w-2 h-2 rounded-full inline-block ${u.IsOnline ? 'bg-green-500' : 'bg-gray-600'}`}></span></td>
            <td className="py-3 px-4 text-gray-400 text-xs">{new Date(u.RegisterDate).toLocaleDateString()}</td>
            <td className="py-3 px-4">
              <button onClick={() => handleEdit(u)} className="text-[#FFE148] hover:underline mr-3 text-xs">Edit</button>
              <button onClick={() => handleDelete(u.ID)} className="text-red-400 hover:underline text-xs">Delete</button>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      
      {editItem && (
        <Modal title="Edit UCP" onClose={() => setEditItem(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div><label className="text-gray-400 text-xs">UCP</label><input name="UCP" defaultValue={editItem.UCP} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Email</label><input name="email" defaultValue={editItem.email} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Discord ID</label><input name="discordid" defaultValue={editItem.discordid || ''} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Admin Level</label><input name="AdminLevel" type="number" defaultValue={editItem.AdminLevel} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">mgold</label><input name="mgold" type="number" defaultValue={editItem.mgold || 0} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Save</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AdminCharacters() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [editItem, setEditItem] = useState(null)
  const limit = 15

  useEffect(() => {
    axios.get(`/api/admin/characters?page=${page}&limit=${limit}`).then(res => {
      setData(res.data.data)
      setTotal(res.data.total)
    }).catch(() => {})
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this character?')) return
    await axios.delete(`/api/admin/characters/${id}`)
    setData(data.filter(d => d.pID !== id))
  }

  const handleEdit = (item) => setEditItem(item)
  const handleSave = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.put(`/api/admin/characters/${editItem.pID}`, form)
    setEditItem(null)
    setData(data.map(d => d.pID === editItem.pID ? { ...d, ...form } : d))
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">Characters</h2>
      <Table headers={['ID', 'Name', 'UCP', 'Level', 'Money', 'Bank', 'Actions']}>
        {data.map(c => (
          <tr key={c.pID} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{c.pID}</td>
            <td className="py-3 px-4 text-white">{c.Name}</td>
            <td className="py-3 px-4 text-gray-400">{c.UCP}</td>
            <td className="py-3 px-4 text-white">{c.Level}</td>
            <td className="py-3 px-4 text-white">${c.Money?.toLocaleString()}</td>
            <td className="py-3 px-4 text-white">${c.BankMoney?.toLocaleString()}</td>
            <td className="py-3 px-4">
              <button onClick={() => handleEdit(c)} className="text-[#FFE148] hover:underline mr-3 text-xs">Edit</button>
              <button onClick={() => handleDelete(c.pID)} className="text-red-400 hover:underline text-xs">Delete</button>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      
      {editItem && (
        <Modal title="Edit Character" onClose={() => setEditItem(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div><label className="text-gray-400 text-xs">Name</label><input name="Name" defaultValue={editItem.Name} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Money</label><input name="Money" type="number" defaultValue={editItem.Money} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Bank</label><input name="BankMoney" type="number" defaultValue={editItem.BankMoney} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Level</label><input name="Level" type="number" defaultValue={editItem.Level} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Skin</label><input name="Skin" type="number" defaultValue={editItem.Skin} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Save</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AdminVehicles() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [editItem, setEditItem] = useState(null)
  const limit = 15

  useEffect(() => {
    axios.get(`/api/admin/vehicles?page=${page}&limit=${limit}`).then(res => {
      setData(res.data.data)
      setTotal(res.data.total)
    }).catch(() => {})
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return
    await axios.delete(`/api/admin/vehicles/${id}`)
    setData(data.filter(d => d.vehID !== id))
  }

  const handleEdit = (item) => setEditItem(item)
  const handleSave = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.put(`/api/admin/vehicles/${editItem.vehID}`, form)
    setEditItem(null)
    setData(data.map(d => d.vehID === editItem.vehID ? { ...d, ...form } : d))
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">Vehicles</h2>
      <Table headers={['ID', 'Model', 'Plate', 'Owner', 'Health', 'Fuel', 'Actions']}>
        {data.map(v => (
          <tr key={v.vehID} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{v.vehID}</td>
            <td className="py-3 px-4 text-white">{v.vehModel}</td>
            <td className="py-3 px-4 text-[#FFE148] font-mono">{v.vehPlate}</td>
            <td className="py-3 px-4 text-gray-400">{v.owner_name || '-'}</td>
            <td className="py-3 px-4 text-white">{Math.round(v.vehHealth)}%</td>
            <td className="py-3 px-4 text-white">{Math.round(v.vehFuel)}%</td>
            <td className="py-3 px-4">
              <button onClick={() => handleEdit(v)} className="text-[#FFE148] hover:underline mr-3 text-xs">Edit</button>
              <button onClick={() => handleDelete(v.vehID)} className="text-red-400 hover:underline text-xs">Delete</button>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
      
      {editItem && (
        <Modal title="Edit Vehicle" onClose={() => setEditItem(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div><label className="text-gray-400 text-xs">Model</label><input name="vehModel" type="number" defaultValue={editItem.vehModel} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Plate</label><input name="vehPlate" defaultValue={editItem.vehPlate} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Health</label><input name="vehHealth" type="number" defaultValue={editItem.vehHealth} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Fuel</label><input name="vehFuel" type="number" defaultValue={editItem.vehFuel} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Save</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AdminHouses() {
  const [data, setData] = useState([])
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    axios.get('/api/admin/houses').then(res => setData(res.data.data)).catch(() => {})
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this house?')) return
    await axios.delete(`/api/admin/houses/${id}`)
    setData(data.filter(d => d.houseID !== id))
  }

  const handleEdit = (item) => setEditItem(item)
  const handleSave = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.put(`/api/admin/houses/${editItem.houseID}`, form)
    setEditItem(null)
    setData(data.map(d => d.houseID === editItem.houseID ? { ...d, ...form } : d))
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">Houses</h2>
      <Table headers={['ID', 'Address', 'Owner', 'Price', 'Vault', 'Locked', 'Actions']}>
        {data.map(h => (
          <tr key={h.houseID} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{h.houseID}</td>
            <td className="py-3 px-4 text-white">{h.houseAddress}</td>
            <td className="py-3 px-4 text-gray-400">{h.owner_name || h.houseOwnerName}</td>
            <td className="py-3 px-4 text-white">${h.housePrice?.toLocaleString()}</td>
            <td className="py-3 px-4 text-white">${h.houseVault?.toLocaleString()}</td>
            <td className="py-3 px-4"><span className={h.houseLocked ? 'text-red-400' : 'text-green-400'}>{h.houseLocked ? 'Yes' : 'No'}</span></td>
            <td className="py-3 px-4">
              <button onClick={() => handleEdit(h)} className="text-[#FFE148] hover:underline mr-3 text-xs">Edit</button>
              <button onClick={() => handleDelete(h.houseID)} className="text-red-400 hover:underline text-xs">Delete</button>
            </td>
          </tr>
        ))}
      </Table>
      
      {editItem && (
        <Modal title="Edit House" onClose={() => setEditItem(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div><label className="text-gray-400 text-xs">Address</label><input name="houseAddress" defaultValue={editItem.houseAddress} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Price</label><input name="housePrice" type="number" defaultValue={editItem.housePrice} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Vault</label><input name="houseVault" type="number" defaultValue={editItem.houseVault} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Save</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AdminBusinesses() {
  const [data, setData] = useState([])
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    axios.get('/api/admin/businesses').then(res => setData(res.data.data)).catch(() => {})
  }, [])

  const handleEdit = (item) => setEditItem(item)
  const handleSave = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.put(`/api/admin/businesses/${editItem.bizID}`, form)
    setEditItem(null)
    setData(data.map(d => d.bizID === editItem.bizID ? { ...d, ...form } : d))
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">Businesses</h2>
      <Table headers={['ID', 'Name', 'Owner ID', 'Price', 'Vault', 'Actions']}>
        {data.map(b => (
          <tr key={b.bizID} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{b.bizID}</td>
            <td className="py-3 px-4 text-white">{b.bizName}</td>
            <td className="py-3 px-4 text-gray-400">{b.bizOwner}</td>
            <td className="py-3 px-4 text-white">${b.bizPrice?.toLocaleString()}</td>
            <td className="py-3 px-4 text-white">${b.bizVault?.toLocaleString()}</td>
            <td className="py-3 px-4">
              <button onClick={() => handleEdit(b)} className="text-[#FFE148] hover:underline text-xs">Edit</button>
            </td>
          </tr>
        ))}
      </Table>
      
      {editItem && (
        <Modal title="Edit Business" onClose={() => setEditItem(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div><label className="text-gray-400 text-xs">Name</label><input name="bizName" defaultValue={editItem.bizName} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Price</label><input name="bizPrice" type="number" defaultValue={editItem.bizPrice} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Vault</label><input name="bizVault" type="number" defaultValue={editItem.bizVault} className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Save</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AdminDonations() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('/api/admin/donations').then(res => setData(res.data)).catch(() => {})
  }, [])

  const updateStatus = async (id, status) => {
    await axios.put(`/api/admin/donations/${id}`, { status })
    setData(data.map(d => d.id === id ? { ...d, status } : d))
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">Donations</h2>
      <Table headers={['ID', 'User', 'Amount', 'Method', 'Status', 'Date', 'Actions']}>
        {data.map(d => (
          <tr key={d.id} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{d.id}</td>
            <td className="py-3 px-4 text-white">{d.UCP}</td>
            <td className="py-3 px-4 text-[#FFE148]">Rp {d.amount?.toLocaleString()}</td>
            <td className="py-3 px-4 text-gray-400">{d.payment_method}</td>
            <td className="py-3 px-4">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                d.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                d.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>{d.status}</span>
            </td>
            <td className="py-3 px-4 text-gray-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
            <td className="py-3 px-4">
              {d.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(d.id, 'completed')} className="text-green-400 hover:underline mr-2 text-xs">Complete</button>
                  <button onClick={() => updateStatus(d.id, 'failed')} className="text-red-400 hover:underline text-xs">Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}

function AdminLogs() {
  const [type, setType] = useState('faction')
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 30

  useEffect(() => {
    axios.get(`/api/admin/logs?type=${type}&page=${page}&limit=${limit}`).then(res => {
      setData(res.data.data)
      setTotal(res.data.total)
    }).catch(() => {})
  }, [type, page])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Logs</h2>
        <div className="flex gap-2">
          {['faction', 'ban', 'donation'].map(t => (
            <button key={t} onClick={() => { setType(t); setPage(1); }} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${type === t ? 'bg-[#FFE148] text-[#0A0C10]' : 'bg-[#13171F] border border-[#2A2E35] text-gray-400'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Table headers={type === 'faction' ? ['ID', 'Faction', 'Player', 'Action', 'Detail', 'Date'] : type === 'ban' ? ['ID', 'UCP', 'Banned By', 'Reason', 'Date'] : ['ID', 'User', 'Amount', 'Status', 'Method', 'Date']}>
        {data.map((item, i) => (
          <tr key={item.id || i} className="hover:bg-[#1A1F2A]/50 transition">
            {type === 'faction' && (
              <>
                <td className="py-3 px-4 text-white">{item.logID}</td>
                <td className="py-3 px-4 text-gray-400">{item.factionName}</td>
                <td className="py-3 px-4 text-white">{item.playerName}</td>
                <td className="py-3 px-4 text-[#FFE148]">{item.action}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{item.detail}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{new Date(item.timestamp).toLocaleDateString()}</td>
              </>
            )}
            {type === 'ban' && (
              <>
                <td className="py-3 px-4 text-white">{item.id}</td>
                <td className="py-3 px-4 text-white">{item.UCP}</td>
                <td className="py-3 px-4 text-gray-400">{item.BannedBy}</td>
                <td className="py-3 px-4 text-red-400 text-xs">{item.Reason}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{new Date(item.DateBanned).toLocaleDateString()}</td>
              </>
            )}
            {type === 'donation' && (
              <>
                <td className="py-3 px-4 text-white">{item.id}</td>
                <td className="py-3 px-4 text-white">{item.UCP}</td>
                <td className="py-3 px-4 text-[#FFE148]">Rp {item.amount?.toLocaleString()}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.status}</span></td>
                <td className="py-3 px-4 text-gray-400">{item.payment_method}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
              </>
            )}
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
    </div>
  )
}

function AdminBans() {
  const [data, setData] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    axios.get('/api/admin/bans').then(res => setData(res.data)).catch(() => {})
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.post('/api/admin/bans', form)
    setShowAdd(false)
    const res = await axios.get('/api/admin/bans')
    setData(res.data)
  }

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/bans/${id}`)
    setData(data.filter(d => d.id !== id))
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Bans</h2>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg">Add Ban</button>
      </div>
      <Table headers={['ID', 'UCP', 'Banned By', 'Reason', 'Date', 'Actions']}>
        {data.map(b => (
          <tr key={b.id} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{b.id}</td>
            <td className="py-3 px-4 text-white">{b.UCP}</td>
            <td className="py-3 px-4 text-gray-400">{b.BannedBy}</td>
            <td className="py-3 px-4 text-red-400 text-xs">{b.Reason}</td>
            <td className="py-3 px-4 text-gray-400 text-xs">{new Date(b.DateBanned).toLocaleDateString()}</td>
            <td className="py-3 px-4">
              <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:underline text-xs">Remove</button>
            </td>
          </tr>
        ))}
      </Table>
      
      {showAdd && (
        <Modal title="Add Ban" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div><label className="text-gray-400 text-xs">UCP</label><input name="UCP" required className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Reason</label><input name="Reason" required className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Banned By</label><input name="BannedBy" required className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Ban Player</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AdminAnnouncements() {
  const [data, setData] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    axios.get('/api/admin/announcements').then(res => setData(res.data)).catch(() => {})
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.target))
    await axios.post('/api/admin/announcements', form)
    setShowAdd(false)
    const res = await axios.get('/api/admin/announcements')
    setData(res.data)
  }

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/announcements/${id}`)
    setData(data.filter(d => d.id !== id))
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Announcements</h2>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg">Add New</button>
      </div>
      <Table headers={['ID', 'Title', 'Author', 'Date', 'Actions']}>
        {data.map(a => (
          <tr key={a.id} className="hover:bg-[#1A1F2A]/50 transition">
            <td className="py-3 px-4 text-white">{a.id}</td>
            <td className="py-3 px-4 text-white">{a.title}</td>
            <td className="py-3 px-4 text-gray-400">{a.author}</td>
            <td className="py-3 px-4 text-gray-400 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
            <td className="py-3 px-4">
              <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:underline text-xs">Delete</button>
            </td>
          </tr>
        ))}
      </Table>
      
      {showAdd && (
        <Modal title="Add Announcement" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <div><label className="text-gray-400 text-xs">Title</label><input name="title" required className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Content</label><textarea name="content" className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none h-24" /></div>
            <div><label className="text-gray-400 text-xs">Description</label><input name="description" className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <div><label className="text-gray-400 text-xs">Author</label><input name="author" required className="w-full px-3 py-2 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white outline-none" /></div>
            <button type="submit" className="w-full py-2 bg-[#FFE148] text-[#0A0C10] font-bold rounded-lg">Create</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default function Admin() {
  const { user } = useAuth()

  if (!user || user.AdminLevel < 1) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen bg-[#0A0C10]">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/ucp" element={<AdminUCP />} />
          <Route path="/characters" element={<AdminCharacters />} />
          <Route path="/vehicles" element={<AdminVehicles />} />
          <Route path="/houses" element={<AdminHouses />} />
          <Route path="/businesses" element={<AdminBusinesses />} />
          <Route path="/donations" element={<AdminDonations />} />
          <Route path="/logs" element={<AdminLogs />} />
          <Route path="/bans" element={<AdminBans />} />
          <Route path="/announcements" element={<AdminAnnouncements />} />
        </Routes>
      </div>
    </div>
  )
}