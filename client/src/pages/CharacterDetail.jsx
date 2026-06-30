import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function CharacterDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inventory')

  useEffect(() => {
    axios.get(`/api/characters/${id}`)
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

  if (!data || !data.character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-10">
          <i className="bi bi-exclamation-triangle text-5xl text-gray-500 mb-4 block" />
          <h3 className="text-xl font-semibold text-white mb-2">Character Not Found</h3>
          <p className="text-gray-400 mb-6">This character does not exist or you do not have permission to view it.</p>
          <Link to="/characters" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition">
            <i className="bi bi-arrow-left"></i> Back to Characters
          </Link>
        </div>
      </div>
    )
  }

  const { 
    character, inventory = [], weapons = [], skills = [], 
    faction, factionStorage = [], factionWeapons = [], 
    phone, contacts = [], seeds, farmer, vehicles = [], insurance = [] 
  } = data

  const tabs = [
    { key: 'inventory', label: 'Inventory', icon: 'bi-box' },
    { key: 'weapons', label: 'Weapons', icon: 'bi-crosshair' },
    { key: 'skills', label: 'Skills', icon: 'bi-star' },
    { key: 'faction', label: 'Faction', icon: 'bi-shield' },
    { key: 'phone', label: 'Phone', icon: 'bi-phone' },
    { key: 'economy', label: 'Economy', icon: 'bi-wallet2' },
    { key: 'vehicles', label: 'Vehicles', icon: 'bi-car-front' },
  ]

  const getStatusColor = (value) => {
    if (value >= 80) return 'text-green-400'
    if (value >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate__animated animate__fadeIn">
      <Link to="/characters" className="inline-flex items-center text-[#FFE148] hover:underline text-sm mb-6 group">
        <i className="bi bi-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> 
        Back to Characters
      </Link>

      <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl overflow-hidden shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 xl:w-1/3 bg-gradient-to-br from-[#0A0C10] to-[#1A1F2A] flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1.5 bg-[#FFE148] text-[#0A0C10] text-xs font-bold rounded-full shadow-lg">
                Level {character.Level}
              </span>
              {character.AdminLevel > 0 && (
                <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                  Admin
                </span>
              )}
            </div>
            <img
              src={`https://assets.open.mp/assets/images/skins/${character.Skin}.png`}
              alt={character.Name}
              className="max-h-80 lg:max-h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://assets.open.mp/assets/images/skins/0.png' }}
            />
          </div>

          <div className="lg:w-3/5 xl:w-2/3 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">
                  {character.Name}
                </h1>
                <p className="text-gray-400 text-sm">
                  {character.Gender === 1 ? 'Male' : 'Female'} • {character.Age} years • {character.Origin}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FFE148]">${(character.Money || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Cash</p>
                </div>
                <div className="w-px h-10 bg-[#2A2E35]" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FFE148]">${(character.BankMoney || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Bank</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0A0C10] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Health</span>
                  <span className={`text-sm font-bold ${getStatusColor(character.Health)}`}>{character.Health}%</span>
                </div>
                <div className="w-full bg-[#2A2E35] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${character.Health}%` }} />
                </div>
              </div>
              <div className="bg-[#0A0C10] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Armor</span>
                  <span className={`text-sm font-bold ${getStatusColor(character.Armor)}`}>{character.Armor}%</span>
                </div>
                <div className="w-full bg-[#2A2E35] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${character.Armor}%` }} />
                </div>
              </div>
              <div className="bg-[#0A0C10] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Hunger</span>
                  <span className={`text-sm font-bold ${getStatusColor(character.Hunger)}`}>{character.Hunger || 100}%</span>
                </div>
                <div className="w-full bg-[#2A2E35] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${character.Hunger || 100}%` }} />
                </div>
              </div>
              <div className="bg-[#0A0C10] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Thirst</span>
                  <span className={`text-sm font-bold ${getStatusColor(character.Thirsty)}`}>{character.Thirsty || 100}%</span>
                </div>
                <div className="w-full bg-[#2A2E35] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${character.Thirsty || 100}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              <div className="bg-[#0A0C10] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Height</p>
                <p className="text-white font-semibold">{character.Height}cm</p>
              </div>
              <div className="bg-[#0A0C10] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Weight</p>
                <p className="text-white font-semibold">{character.Weight}kg</p>
              </div>
              <div className="bg-[#0A0C10] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Hair</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: `#${(character.HairColor || 0).toString(16).padStart(6, '0')}` }} />
                  <span className="text-white font-semibold text-xs">{character.HairColor || 0}</span>
                </div>
              </div>
              <div className="bg-[#0A0C10] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Eyes</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: `#${(character.EyeColor || 0).toString(16).padStart(6, '0')}` }} />
                  <span className="text-white font-semibold text-xs">{character.EyeColor || 0}</span>
                </div>
              </div>
              <div className="bg-[#0A0C10] rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Skin Tone</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: `#${(character.SkinColor || 0).toString(16).padStart(6, '0')}` }} />
                  <span className="text-white font-semibold text-xs">{character.SkinColor || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-[#FFE148] text-[#0A0C10] shadow-lg shadow-[#FFE148]/20'
                : 'bg-[#13171F] text-gray-400 hover:text-white hover:bg-[#1A1F2A] border border-[#2A2E35]'
            }`}
          >
            <i className={`bi ${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-6 animate__animated animate__fadeIn">
        {activeTab === 'inventory' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-box text-[#FFE148]"></i> Inventory Items
              {inventory.length > 0 && (
                <span className="text-sm font-normal text-gray-400">({inventory.length} items)</span>
              )}
            </h3>
            {inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#2A2E35]">
                      <th className="py-3 px-4 text-left font-medium">Item Name</th>
                      <th className="py-3 px-4 text-left font-medium">Model ID</th>
                      <th className="py-3 px-4 text-right font-medium">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item, i) => (
                      <tr key={i} className="border-b border-[#2A2E35]/50 hover:bg-white/5 transition">
                        <td className="py-3 px-4 text-white">{item.invItem}</td>
                        <td className="py-3 px-4 text-gray-400">{item.invModel}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-white font-semibold bg-[#0A0C10] px-3 py-1 rounded-full">{item.invQuantity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-box text-5xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">No items in inventory.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'weapons' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-crosshair text-[#FFE148]"></i> Weapons
              {weapons.length > 0 && (
                <span className="text-sm font-normal text-gray-400">({weapons.length} weapons)</span>
              )}
            </h3>
            {weapons.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#2A2E35]">
                      <th className="py-3 px-4 text-left font-medium">Weapon ID</th>
                      <th className="py-3 px-4 text-left font-medium">Ammo</th>
                      <th className="py-3 px-4 text-left font-medium">Type</th>
                      <th className="py-3 px-4 text-left font-medium">Durability</th>
                      <th className="py-3 px-4 text-left font-medium">Serial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weapons.map((wep, i) => (
                      <tr key={i} className="border-b border-[#2A2E35]/50 hover:bg-white/5 transition">
                        <td className="py-3 px-4 text-white font-semibold">{wep.weapon_id}</td>
                        <td className="py-3 px-4 text-white">{wep.weapon_ammo}</td>
                        <td className="py-3 px-4">
                          <span className="text-gray-300 bg-[#0A0C10] px-2 py-1 rounded text-xs">{wep.ammo_type_name || 'None'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-[#2A2E35] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${wep.weapon_durability > 60 ? 'bg-green-500' : wep.weapon_durability > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${wep.weapon_durability}%` }} 
                              />
                            </div>
                            <span className="text-white text-xs">{wep.weapon_durability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-xs">{wep.weapon_serial || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-crosshair text-5xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">No weapons owned.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-star text-[#FFE148]"></i> Skills
            </h3>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill, i) => (
                  <div key={i} className="bg-[#0A0C10] p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm capitalize">{skill.skill_name || `Skill ${skill.skill_type}`}</span>
                      <span className="text-[#FFE148] font-bold text-sm">{skill.skill_level}/999</span>
                    </div>
                    <div className="w-full bg-[#2A2E35] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFE148] rounded-full" style={{ width: `${(skill.skill_level / 999) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-star text-5xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">No skills developed yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'faction' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-shield text-[#FFE148]"></i> Faction
            </h3>
            {faction ? (
              <div className="space-y-6">
                <div className="bg-[#0A0C10] p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#FFE148] rounded-full flex items-center justify-center">
                      <i className="bi bi-shield-fill text-[#0A0C10] text-xl"></i>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{faction.factionName}</p>
                      <p className="text-gray-400 text-sm">Rank: {faction.factionRank} {faction.factionLeader ? '(Leader)' : ''}</p>
                    </div>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${faction.factionDuty ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {faction.factionDuty ? 'On Duty' : 'Off Duty'}
                    </span>
                  </div>
                </div>

                {factionStorage.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <i className="bi bi-archive text-[#FFE148]"></i> Faction Storage
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 border-b border-[#2A2E35]">
                            <th className="py-2 px-4 text-left font-medium">Item</th>
                            <th className="py-2 px-4 text-left font-medium">Model</th>
                            <th className="py-2 px-4 text-right font-medium">Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {factionStorage.map((item, i) => (
                            <tr key={i} className="border-b border-[#2A2E35]/50">
                              <td className="py-2 px-4 text-white">{item.itemName}</td>
                              <td className="py-2 px-4 text-gray-400">{item.itemModel}</td>
                              <td className="py-2 px-4 text-right text-white">{item.itemQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {factionWeapons.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <i className="bi bi-crosshair text-[#FFE148]"></i> Faction Weapons
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 border-b border-[#2A2E35]">
                            <th className="py-2 px-4 text-left font-medium">Weapon ID</th>
                            <th className="py-2 px-4 text-left font-medium">Ammo</th>
                            <th className="py-2 px-4 text-left font-medium">Min Rank</th>
                          </tr>
                        </thead>
                        <tbody>
                          {factionWeapons.map((wep, i) => (
                            <tr key={i} className="border-b border-[#2A2E35]/50">
                              <td className="py-2 px-4 text-white">{wep.fwWeaponID}</td>
                              <td className="py-2 px-4 text-white">{wep.fwAmmo}</td>
                              <td className="py-2 px-4 text-white">{wep.fwMinRank}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-shield text-5xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">Not a member of any faction.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'phone' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-phone text-[#FFE148]"></i> Phone
            </h3>
            {phone ? (
              <div className="space-y-6">
                <div className="bg-[#0A0C10] p-5 rounded-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phone Number</p>
                      <p className="text-white font-bold text-lg">{phone.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Credits</p>
                      <p className="text-white font-bold text-lg">{phone.credits}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Balance</p>
                      <p className="text-white font-bold text-lg">${phone.balance}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">PIN</p>
                      <p className="text-white font-bold text-lg">{phone.phone_pin || '1234'}</p>
                    </div>
                  </div>
                </div>

                {contacts.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <i className="bi bi-people text-[#FFE148]"></i> Contacts ({contacts.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contacts.map((c, i) => (
                        <div key={i} className="bg-[#0A0C10] p-3 rounded-xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FFE148] rounded-full flex items-center justify-center text-[#0A0C10] font-bold text-sm">
                            {c.contact_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{c.contact_name}</p>
                            <p className="text-gray-400 text-xs">{c.contact_number}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-phone text-5xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">No phone data available.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'economy' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-wallet2 text-[#FFE148]"></i> Economy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0A0C10] p-5 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Cash</p>
                <p className="text-[#FFE148] text-2xl font-bold">${(character.Money || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#0A0C10] p-5 rounded-xl">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Bank</p>
                <p className="text-[#FFE148] text-2xl font-bold">${(character.BankMoney || 0).toLocaleString()}</p>
              </div>
              {farmer && (
                <div className="bg-[#0A0C10] p-5 rounded-xl">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Farmer Level</p>
                  <p className="text-white text-2xl font-bold">{farmer.level}</p>
                  <p className="text-gray-500 text-xs mt-1">Exp: {farmer.exp} • Plants: {farmer.plants} • Harvests: {farmer.harvests}</p>
                </div>
              )}
            </div>

            {seeds && (
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <i className="bi bi-flower1 text-[#FFE148]"></i> Seeds
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { label: 'Potato', value: seeds.potato_seeds },
                    { label: 'Wheat', value: seeds.wheat_seeds },
                    { label: 'Corn', value: seeds.corn_seeds },
                    { label: 'Tomato', value: seeds.tomato_seeds },
                    { label: 'Carrot', value: seeds.carrot_seeds },
                    { label: 'Rice', value: seeds.rice_seeds },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#0A0C10] p-3 rounded-lg text-center">
                      <p className="text-white font-bold">{s.value || 0}</p>
                      <p className="text-gray-500 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insurance.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <i className="bi bi-shield-check text-[#FFE148]"></i> Vehicle Insurance
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-[#2A2E35]">
                        <th className="py-2 px-4 text-left font-medium">Vehicle ID</th>
                        <th className="py-2 px-4 text-left font-medium">Start Date</th>
                        <th className="py-2 px-4 text-left font-medium">End Date</th>
                        <th className="py-2 px-4 text-right font-medium">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insurance.map((ins, i) => (
                        <tr key={i} className="border-b border-[#2A2E35]/50">
                          <td className="py-2 px-4 text-white">{ins.vehicleID}</td>
                          <td className="py-2 px-4 text-gray-400">{new Date(ins.startTime * 1000).toLocaleDateString()}</td>
                          <td className="py-2 px-4 text-gray-400">{new Date(ins.endTime * 1000).toLocaleDateString()}</td>
                          <td className="py-2 px-4 text-right text-white">${ins.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="bi bi-car-front text-[#FFE148]"></i> Vehicles
              {vehicles.length > 0 && (
                <span className="text-sm font-normal text-gray-400">({vehicles.length} vehicles)</span>
              )}
            </h3>
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map(veh => (
                  <div key={veh.vehID} className="bg-[#0A0C10] p-4 rounded-xl hover:bg-[#1A1F2A] transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold text-lg">Model {veh.vehModel}</p>
                        <p className="text-gray-400 text-sm">Plate: <span className="text-[#FFE148] font-mono">{veh.vehPlate}</span></p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${veh.vehInsurance ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {veh.vehInsurance ? 'Insured' : 'No Insurance'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Health</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#2A2E35] h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${veh.vehHealth > 60 ? 'bg-green-500' : veh.vehHealth > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${veh.vehHealth}%` }} />
                          </div>
                          <span className="text-white text-xs">{veh.vehHealth}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fuel</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#2A2E35] h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FFE148] rounded-full" style={{ width: `${veh.vehFuel}%` }} />
                          </div>
                          <span className="text-white text-xs">{veh.vehFuel}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Locked</span>
                        <span className="text-white">{veh.vehLocked ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-car-front text-5xl text-gray-600 mb-3 block" />
                <p className="text-gray-400">No vehicles owned.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}