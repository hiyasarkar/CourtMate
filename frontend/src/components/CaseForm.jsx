import { useState } from 'react'
import { ArrowRight, Info } from 'lucide-react'

const MICRO_LESSONS = {
  defendant_name: {
    title: 'Who is the Defendant?',
    tip: 'Use the official company name as printed on your receipt, bill, or packaging.',
    example: 'E.g., "Reliance Retail Ltd." (not just "Reliance")',
    color: 'blue',
  },
  claim_amount: {
    title: 'Maximize Your Claim!',
    tip: 'Under the Consumer Protection Act 2019, you can claim more than just the product cost.',
    example: 'Add: Product cost + Travel expenses + Mental agony + Loss of income',
    color: 'green',
  },
  incident_date: {
    title: 'Time Limit Warning!',
    tip: 'Consumer complaints must be filed within 2 years of the incident.',
    example: 'Make sure your incident date is within this window.',
    color: 'red',
  },
  state: {
    title: 'Which Consumer Forum?',
    tip: 'Your complaint is filed in the District Consumer Forum of your state.',
    example: 'Claims up to ₹50 lakh → District Forum. ₹50L–₹2Cr → State Commission.',
    color: 'orange',
  },
}

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-700', text: 'text-blue-600', ex: 'text-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-700', text: 'text-green-600', ex: 'text-green-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', title: 'text-red-700', text: 'text-red-600', ex: 'text-red-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', title: 'text-orange-700', text: 'text-orange-600', ex: 'text-orange-500' },
}

export default function CaseForm({ grievanceData, onSubmit }) {
  const [formData, setFormData] = useState({
    defendant_name: '',
    claim_amount: '',
    incident_date: '',
    city: '',
    state: '',
    pin_code: '',
  })
  const [activeField, setActiveField] = useState(null)
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleFocus(field) {
    setActiveField(field)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.defendant_name.trim()) { setError('Please enter the defendant name.'); return }
    if (!formData.claim_amount || Number(formData.claim_amount) <= 0) { setError('Please enter a valid claim amount.'); return }
    if (!formData.incident_date) { setError('Please enter the date of incident.'); return }
    setError('')
    onSubmit({ ...grievanceData, ...formData, claim_amount: Number(formData.claim_amount) })
  }

  const lesson = activeField && MICRO_LESSONS[activeField] ? MICRO_LESSONS[activeField] : null
  const c = lesson ? colorMap[lesson.color] : null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        {grievanceData && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-green-700 text-sm font-semibold">
              Legal Category Identified: <span className="font-bold">{grievanceData.legal_category}</span>
            </p>
            <p className="text-green-600 text-xs mt-1">{grievanceData.summary}</p>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800">Case Details</h2>
        <p className="text-gray-500 mt-1 text-sm">Fill in the details. Click each field for helpful tips.</p>
      </div>

      <div className="flex gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
          {/* Defendant */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Company / Person You Are Suing *
            </label>
            <input
              value={formData.defendant_name}
              onChange={e => handleChange('defendant_name', e.target.value)}
              onFocus={() => handleFocus('defendant_name')}
              onBlur={() => setActiveField(null)}
              placeholder="Full registered company name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Claim Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Claim Amount (₹) *
            </label>
            <input
              type="number"
              value={formData.claim_amount}
              onChange={e => handleChange('claim_amount', e.target.value)}
              onFocus={() => handleFocus('claim_amount')}
              onBlur={() => setActiveField(null)}
              placeholder="Total compensation sought"
              min="1"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date of Incident *
            </label>
            <input
              type="date"
              value={formData.incident_date}
              onChange={e => handleChange('incident_date', e.target.value)}
              onFocus={() => handleFocus('incident_date')}
              onBlur={() => setActiveField(null)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input
                value={formData.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="Your city"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input
                value={formData.state}
                onChange={e => handleChange('state', e.target.value)}
                onFocus={() => handleFocus('state')}
                onBlur={() => setActiveField(null)}
                placeholder="Your state"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Pin code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PIN Code</label>
            <input
              value={formData.pin_code}
              onChange={e => handleChange('pin_code', e.target.value)}
              placeholder="6-digit PIN code"
              maxLength={6}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition duration-200 cursor-pointer mt-2"
          >
            Analyze My Case
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Micro-lesson sidebar */}
        <div className="w-72 shrink-0">
          {lesson && c ? (
            <div className={`${c.bg} border ${c.border} rounded-2xl p-5 flex flex-col gap-3 sticky top-6`}>
              <div className="flex items-center gap-2">
                <Info className={`w-5 h-5 ${c.title}`} />
                <h4 className={`font-bold text-sm ${c.title}`}>{lesson.title}</h4>
              </div>
              <p className={`text-sm ${c.text}`}>{lesson.tip}</p>
              <p className={`text-xs ${c.ex} italic`}>{lesson.example}</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-gray-400" />
                <h4 className="font-bold text-sm text-gray-500">Pro Tips</h4>
              </div>
              <p className="text-xs text-gray-400">
                Click on any form field to see helpful legal tips and examples.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
