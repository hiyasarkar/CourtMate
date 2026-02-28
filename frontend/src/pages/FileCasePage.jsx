import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import GrievanceForm from '../components/GrievanceForm.jsx'
import CaseForm from '../components/CaseForm.jsx'
import ConfidenceMeter from '../components/ConfidenceMeter.jsx'
import { supabase } from '../lib/supabase.js'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const STEPS = [
  { number: 1, label: 'Describe Problem' },
  { number: 2, label: 'Case Details' },
  { number: 3, label: 'Analysis' },
]

export default function FileCasePage() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [grievanceData, setGrievanceData] = useState(null)
  const [caseData, setCaseData] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')

  // After Auth0 login completes, upsert the user profile into Supabase.
  // Auth0 user.sub looks like "google-oauth2|1234..." — we use it as the TEXT id.
  // This runs once when the user becomes authenticated.
  useEffect(() => {
    if (!isAuthenticated || !user) return

    supabase
      .from('profiles')
      .upsert(
        {
          id: user.sub,
          full_name: user.name,
          email: user.email,
          picture: user.picture,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .then(({ error }) => {
        if (error) {
          console.warn('Supabase profile save warning:', error.message)
        }
      })
  }, [isAuthenticated, user])

  // Show loading state while Auth0 is initialising
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 animate-pulse">Loading...</div>
      </div>
    )
  }

  // Not authenticated — show inline login prompt
  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-5 max-w-md w-full">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 rounded-full px-4 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
              <span className="text-orange-500 text-sm font-medium">CourtMate AI</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Sign in to file your case</h2>
            <p className="text-gray-500 text-sm text-center">
              Secure login powered by Auth0. Your profile is automatically saved.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition duration-200 cursor-pointer shadow-md"
            >
              Log In to CourtMate
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Step 1 → 2: Grievance translated by Gemini
  function handleGrievanceTranslated(data) {
    setGrievanceData(data)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 2 → 3: Analyze case with Gemini + IndianKanoon, then save to Supabase
  async function handleCaseSubmit(formData) {
    setAnalyzing(true)
    setAnalyzeError('')

    try {
      const payload = {
        translated_text: formData.translated_text,
        legal_category: formData.legal_category,
        defendant_name: formData.defendant_name,
        claim_amount: formData.claim_amount,
        incident_date: formData.incident_date,
      }

      const res = await fetch(`${BACKEND_URL}/cases/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const result = await res.json()
      if (result.error) throw new Error(result.error)

      setCaseData(formData)
      setAnalysisResult(result)
      setStep(3)

      // Save case to Supabase — non-blocking, won't crash the UI if it fails
      supabase
        .from('cases')
        .insert({
          user_id: user?.sub || 'anonymous',
          legal_category: formData.legal_category,
          defendant_name: formData.defendant_name,
          claim_amount: formData.claim_amount,
          incident_date: formData.incident_date,
          translated_text: formData.translated_text,
          confidence_score: result.confidence_score,
          complexity: result.complexity,
          legal_sections: result.legal_sections,
          courtroom_script: result.courtroom_script,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase case save warning:', error.message)
        })

      // Log anonymous analytics event
      if (formData.pin_code && formData.state && formData.city) {
        fetch(`${BACKEND_URL}/analytics/log-case`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            legal_category: formData.legal_category,
            pin_code: formData.pin_code || '000000',
            state: formData.state || 'Unknown',
            city: formData.city || 'Unknown',
          }),
        }).catch(() => {})
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setAnalyzeError(err.message || 'Analysis failed. Check that the backend is running.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            File Your <span className="text-orange-500">Consumer Case</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Welcome, {user?.name}. Follow the steps below to build your case.
          </p>
        </div>

        {/* Progress stepper */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, idx) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s.number
                      ? 'bg-green-500 text-white'
                      : step === s.number
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.number ? '✓' : s.number}
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    step === s.number ? 'text-orange-500' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-20 mx-1 mb-4 transition-all duration-300 ${
                    step > s.number ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Analyzing spinner */}
        {analyzing && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600 font-medium">
              Gemini AI is analyzing your case against Indian Kanoon precedents...
            </p>
            <p className="text-gray-400 text-sm">This usually takes 5–15 seconds.</p>
          </div>
        )}

        {analyzeError && !analyzing && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm mb-6">
            {analyzeError}
            <button
              onClick={() => { setAnalyzeError(''); setStep(2) }}
              className="ml-3 underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {/* Step content */}
        {!analyzing && !analyzeError && (
          <>
            {step === 1 && <GrievanceForm onTranslated={handleGrievanceTranslated} />}
            {step === 2 && <CaseForm grievanceData={grievanceData} onSubmit={handleCaseSubmit} />}
            {step === 3 && analysisResult && (
              <ConfidenceMeter caseData={caseData} analysisResult={analysisResult} />
            )}
          </>
        )}

        {/* Back navigation */}
        {step > 1 && !analyzing && (
          <div className="mt-8 text-center">
            <button
              onClick={() => { setStep(s => s - 1); setAnalyzeError('') }}
              className="text-gray-400 text-sm hover:text-gray-600 cursor-pointer transition duration-200"
            >
              ← Go back to previous step
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
