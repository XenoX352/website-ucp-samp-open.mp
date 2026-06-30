import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Characters() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/characters')
      .then(res => setCharacters(res.data.characters || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FFE148] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Characters</h2>
          <p className="text-gray-400 text-sm mt-1">Select a character to view full details.</p>
        </div>
        <Link
          to="/characters/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition-colors"
        >
          <i className="bi bi-person-plus"></i> Create Character
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="bg-[#13171F] border border-[#2A2E35] rounded-xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1A1F2A] flex items-center justify-center">
            <i className="bi bi-people text-4xl text-gray-500"></i>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Characters Yet</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
            You haven't created any characters yet. Create your first character to start your journey in Los Santos.
          </p>
          <Link
            to="/characters/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] transition-colors"
          >
            <i className="bi bi-person-plus"></i> Create Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {characters.map(char => (
            <Link
              key={char.pID}
              to={`/characters/${char.pID}`}
              className="block bg-[#13171F] rounded-xl overflow-hidden hover:border-[#FFE148] transition-all duration-200 group"
            >
              <div className="aspect-square bg-[#0A0C10] flex items-center justify-center p-4">
                <img
                  src={`https://assets.open.mp/assets/images/skins/${char.Skin}.png`}
                  alt={char.Name}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = 'https://assets.open.mp/assets/images/skins/0.png' }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <i className="bi bi-person-circle text-[#FFE148]"></i>
                  <h3 className="font-semibold text-white text-lg truncate">{char.Name}</h3>
                </div>
                <p className="text-sm text-gray-400">Level {char.Level}</p>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-gray-300">${char.Money.toLocaleString()}</span>
                  <span className="text-gray-500">Bank ${char.BankMoney.toLocaleString()}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#1A1F2A] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hairColors[char.HairColor]?.hex || '#1A1A1A' }}></span>
                      Hair
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eyeColors[char.EyeColor]?.hex || '#1A1A1A' }}></span>
                      Eyes
                    </span>
                  </div>
                  <span className="text-[#FFE148] text-sm font-medium">View Details <i className="bi bi-arrow-right text-xs ml-1"></i></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const hairColors = [
  { value: 0, label: 'Black', hex: '#1A1A1A' },
  { value: 1, label: 'White', hex: '#F0F0F0' },
  { value: 2, label: 'Blonde', hex: '#E6C875' },
  { value: 3, label: 'Red', hex: '#C0392B' },
  { value: 4, label: 'Brown', hex: '#5C3A21' },
]

const eyeColors = [
  { value: 0, label: 'Black', hex: '#1A1A1A' },
  { value: 1, label: 'White', hex: '#F0F0F0' },
]