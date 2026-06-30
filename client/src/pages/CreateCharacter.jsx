import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const hairColors = [
  { label: 'Black', value: 0, hex: '#1a1a1a' },
  { label: 'White', value: 1, hex: '#ffffff' },
  { label: 'Red', value: 2, hex: '#cc0000' },
  { label: 'Blonde', value: 3, hex: '#ffcc00' },
  { label: 'Brown', value: 4, hex: '#4a3728' },
]

const eyeColors = [
  { label: 'Black', value: 0, hex: '#1a1a1a' },
  { label: 'Blue', value: 1, hex: '#0066cc' },
  { label: 'Green', value: 2, hex: '#009933' },
  { label: 'Brown', value: 3, hex: '#4a3728' },
]

const skinColors = [
  { label: 'Light', value: 0, hex: '#f5d5c8' },
  { label: 'Dark', value: 1, hex: '#3d2b1f' },
  { label: 'Olive', value: 2, hex: '#c4a882' },
]

export default function CreateCharacter() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: 25,
    origin: 'Los Santos',
    height: 175,
    weight: 70,
    gender: 1,
    skin: 240,
    hairColor: 0,
    eyeColor: 0,
    skinColor: 0,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()

    if (!firstName || !lastName) {
      setError('Both first name and last name are required.')
      setLoading(false)
      return
    }

    if (!/^[A-Z][a-z]+$/.test(firstName) || !/^[A-Z][a-z]+$/.test(lastName)) {
      setError('Names must start with a capital letter and contain only letters.')
      setLoading(false)
      return
    }

    const fullName = `${firstName}_${lastName}`

    try {
      const res = await axios.post('/api/characters/create', {
        name: fullName,
        age: form.age,
        origin: form.origin,
        height: form.height,
        weight: form.weight,
        gender: form.gender,
        skin: form.skin,
        hairColor: form.hairColor,
        eyeColor: form.eyeColor,
        skinColor: form.skinColor,
      })
      if (res.data.success) {
        setSuccess('Character created successfully!')
        setTimeout(() => navigate('/characters'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create character.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate__animated animate__fadeInUp">
        <Link
          to="/characters"
          className="inline-flex items-center text-[#FFE148] hover:underline text-sm mb-4"
        >
          <i className="bi bi-arrow-left mr-1"></i> Back to Characters
        </Link>

        <div className="bg-[#13171F] border border-[#2A2E35] rounded-2xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Create New Character
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-sm text-center animate__animated animate__shakeX">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-lg mb-4 text-sm text-center animate__animated animate__fadeIn">
              {success}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Preview */}
            <div className="lg:w-1/3 flex flex-col items-center justify-center">
              <div className="w-40 h-60 rounded-xl flex items-center justify-center overflow-hidden animate__animated animate__fadeInLeft">
                <img
                  src={`https://assets.open.mp/assets/images/skins/${form.skin}.png`}
                  alt="Preview"
                  className="max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://assets.open.mp/assets/images/skins/0.png'
                  }}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-[#2A2E35]"
                  style={{ backgroundColor: hairColors[form.hairColor]?.hex || '#1a1a1a' }}
                  title={`Hair: ${hairColors[form.hairColor]?.label}`}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-[#2A2E35]"
                  style={{ backgroundColor: eyeColors[form.eyeColor]?.hex || '#1a1a1a' }}
                  title={`Eyes: ${eyeColors[form.eyeColor]?.label}`}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-[#2A2E35]"
                  style={{ backgroundColor: skinColors[form.skinColor]?.hex || '#f5d5c8' }}
                  title={`Skin: ${skinColors[form.skinColor]?.label}`}
                />
              </div>
              <p className="text-gray-400 text-xs mt-2">
                {form.firstName} {form.lastName || 'Xeno Tadasi'}
              </p>
            </div>

            {/* Form */}
            <div className="lg:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="e.g., Xeno"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="e.g., Tadasi"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Age, Origin, Gender */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      min={18}
                      max={100}
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Origin</label>
                    <input
                      type="text"
                      name="origin"
                      placeholder="Los Santos"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.origin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    <select
                      name="gender"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value={1}>Male</option>
                      <option value={2}>Female</option>
                    </select>
                  </div>
                </div>

                {/* Height, Weight, Skin */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      min={150}
                      max={220}
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.height}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      min={50}
                      max={150}
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.weight}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Skin ID</label>
                    <input
                      type="number"
                      name="skin"
                      min={0}
                      max={311}
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.skin}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Hair, Eye, Skin Color */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Hair Color</label>
                    <select
                      name="hairColor"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.hairColor}
                      onChange={handleChange}
                    >
                      {hairColors.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Eye Color</label>
                    <select
                      name="eyeColor"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.eyeColor}
                      onChange={handleChange}
                    >
                      {eyeColors.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Skin Color</label>
                    <select
                      name="skinColor"
                      className="w-full px-4 py-2.5 bg-[#0A0C10] border border-[#2A2E35] rounded-lg text-white focus:border-[#FFE148] outline-none transition"
                      value={form.skinColor}
                      onChange={handleChange}
                    >
                      {skinColors.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2E35]">
                  <Link
                    to="/characters"
                    className="px-5 py-2.5 border border-[#2A2E35] text-gray-300 rounded-lg hover:bg-[#2A2E35] transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#FFE148] text-[#0A0C10] font-semibold rounded-lg hover:bg-[#E6CA3E] disabled:opacity-60 transition"
                  >
                    {loading ? 'Creating...' : 'Create Character'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}