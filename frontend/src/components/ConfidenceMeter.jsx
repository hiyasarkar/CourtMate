import { useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import { Download, Mic, AlertTriangle, CheckCircle, Users } from 'lucide-react'

import { supabase } from '../lib/supabase'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function ConfidenceMeter({ caseData, analysisResult }) {
  const { confidence_score, complexity, legal_sections, reasoning, courtroom_script, kanoon_cases } = analysisResult

  const [audioLoading, setAudioLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [audioError, setAudioError] = useState('')
  const [suggestedLawyers, setSuggestedLawyers] = useState([])
  const [showLawyers, setShowLawyers] = useState(false)
  const [loadingLawyers, setLoadingLawyers] = useState(false)

  // Gauge semicircle data
  const gaugeData = [
    { value: confidence_score },
    { value: 100 - confidence_score },
  ]

  const gaugeColor =
    confidence_score >= 70 ? '#16a34a' :
    confidence_score >= 40 ? '#ea580c' :
    '#dc2626'

  const verdictLabel =
    confidence_score >= 70 ? 'Strong Case' :
    confidence_score >= 40 ? 'Moderate Case' :
    'Weak Case — Lawyer Recommended'

  async function handleVoicePractice() {
    setAudioError('')
    setAudioLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/ai/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: courtroom_script }),
      })
      if (!res.ok) throw new Error('Audio generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.play()
    } catch (err) {
      setAudioError('Could not generate audio. Check your ElevenLabs API key.')
    } finally {
      setAudioLoading(false)
    }
  }

  async function handleDownloadPDF() {
    setPdfLoading(true)
    try {
      const payload = {
        defendant_name: caseData.defendant_name,
        claim_amount: caseData.claim_amount,
        incident_date: caseData.incident_date,
        legal_category: caseData.legal_category,
        translated_text: caseData.translated_text,
        legal_sections: legal_sections || [],
        courtroom_script: courtroom_script || '',
        confidence_score: confidence_score,
        complexity: complexity,
      }
      const res = await fetch(`${BACKEND_URL}/cases/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'courtmate_complaint.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('PDF download failed. Check that the backend is running.')
    } finally {
      setPdfLoading(false)
    }
  }

  async function handleFindLawyers() {
    setShowLawyers(true)
    setLoadingLawyers(true)
    try {
      const caseType = caseData?.legal_category || ''
      // Try to find lawyers matching the case type domain
      // If we don't have matching ones, we can just fetch some verified lawyers
      let { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .not('reg_no', 'is', null)
        .ilike('domain', `%${caseType}%`)
        .limit(3)
        
      if (error) throw error

      // Fallback if no exact domain match
      if (!data || data.length === 0) {
        const fallback = await supabase
          .from('lawyers')
          .select('*')
          .not('reg_no', 'is', null)
          .limit(3)
        data = fallback.data
      }

      setSuggestedLawyers(data || [])
    } catch (err) {
      console.error('Error fetching lawyers:', err.message)
    } finally {
      setLoadingLawyers(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      {/* Gauge + Score */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Your Case Analysis</h2>
        <p className="text-gray-500 text-sm mb-4">Powered by Gemini AI + Indian Kanoon Precedents</p>

        {/* Recharts semicircle gauge */}
        <div className="relative" style={{ width: 240, height: 130 }}>
          <PieChart width={240} height={130}>
            <Pie
              data={gaugeData}
              startAngle={180}
              endAngle={0}
              innerRadius={65}
              outerRadius={100}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={gaugeColor} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
          {/* Score label in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
            <span className="text-3xl font-extrabold" style={{ color: gaugeColor }}>
              {confidence_score}%
            </span>
            <span className="text-xs font-semibold text-gray-500">{verdictLabel}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-3 flex-wrap justify-center">
          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
            Complexity: <b>{complexity}</b>
          </span>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          AI Reasoning
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{reasoning}</p>
      </div>

      {/* Legal Sections */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-3">Applicable Legal Sections</h3>
        <ul className="flex flex-col gap-1">
          {(legal_sections || []).map((sec, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
              {sec}
            </li>
          ))}
        </ul>
      </div>

      {/* Indian Kanoon precedents */}
      {kanoon_cases && kanoon_cases.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-800 mb-3 text-sm">Similar Cases (Indian Kanoon)</h3>
          <ul className="flex flex-col gap-1">
            {kanoon_cases.map((c, i) => (
              <li key={i} className="text-xs text-blue-600 flex items-start gap-2">
                <span className="font-bold">&#8226;</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Courtroom Script */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-2">Your Courtroom Statement</h3>
        <p className="text-gray-500 text-xs mb-3">Read this statement in court. Practice it with voice below.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-700 leading-relaxed italic">
          {courtroom_script}
        </div>

        {/* Voice Practice */}
        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            onClick={handleVoicePractice}
            disabled={audioLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition duration-200 disabled:opacity-60 cursor-pointer"
          >
            {audioLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                Generating Audio...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Practice Speaking (ElevenLabs)
              </>
            )}
          </button>
          {audioError && <p className="text-red-500 text-xs mt-1">{audioError}</p>}
        </div>
      </div>

      {/* PDF Download */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-1">Download Your Complaint</h3>
        <p className="text-gray-500 text-sm mb-4">
          Get a professional PDF with all case details, legal sections, and your courtroom statement.
        </p>
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition duration-200 disabled:opacity-60 cursor-pointer"
        >
          {pdfLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Complaint PDF
            </>
          )}
        </button>
      </div>

      {/* Lawyer Bridge — shown when complexity is Complex or score is low */}
      {(complexity === 'Complex' || confidence_score < 50) && (
        <div className="bg-orange-50 border-2 border-orange-400 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-orange-800">This Case Has Legal Nuances</h3>
          </div>
          <p className="text-orange-700 text-sm">
            Your case is rated <b>{complexity}</b> with a {confidence_score}% confidence score.
            We recommend consulting a verified consumer rights lawyer before filing.
          </p>
          
          {!showLawyers ? (
            <button 
              onClick={handleFindLawyers}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition duration-200 cursor-pointer w-fit"
            >
              <Users className="w-4 h-4" />
              Find a Verified Lawyer in Your City
            </button>
          ) : (
            <div className="mt-2 bg-white rounded-xl p-4 shadow-inner border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" /> Suggested Lawyers for '{caseData?.legal_category || 'Your Case'}'
              </h4>
              
              {loadingLawyers ? (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full inline-block"></span>
                  Finding verified experts...
                </div>
              ) : suggestedLawyers.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {suggestedLawyers.map(lawyer => (
                    <div key={lawyer.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        {lawyer.avatar_url ? (
                           <img src={lawyer.avatar_url} alt={lawyer.full_name} className="w-10 h-10 rounded-full object-cover border border-orange-200" />
                        ) : (
                           <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                             {lawyer.full_name?.charAt(0).toUpperCase() || 'L'}
                           </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{lawyer.full_name}</p>
                          <p className="text-xs text-gray-500">{lawyer.domain || 'General Consumer Law'} • Verified ({lawyer.reg_no})</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No matching lawyers found in our system right now.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
