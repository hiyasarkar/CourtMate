import { useState } from 'react'
import { Upload, FileText, Globe, ArrowRight } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function GrievanceForm({ onTranslated }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() && !file) {
      setError('Please describe your problem or upload an image.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('text', text)
      if (file) formData.append('file', file)

      const res = await fetch(`${BACKEND_URL}/ai/translate-grievance`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      if (data.error) throw new Error(data.error)
      onTranslated(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-blue-600 text-sm font-medium mb-3">
          <Globe className="w-4 h-4" />
          Supports Hindi, Tamil, Telugu, Bengali, English &amp; more
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Describe Your Problem</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Write in any Indian language. You can also upload a bill, invoice, or photo of a document.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
        {/* Text area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe your grievance
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Example: Mera phone ek mahine mein hi kharab ho gaya. Samsung ne warranty reject kar di..."
            rows={5}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Attach a document / image (optional)
          </label>
          <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:border-orange-400 transition duration-200">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {file ? file.name : 'Click to upload bill, invoice, or photo'}
            </span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs text-red-400 mt-1 hover:underline cursor-pointer"
            >
              Remove file
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition duration-200 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              Analyzing with Gemini AI...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Translate &amp; Identify Legal Category
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
