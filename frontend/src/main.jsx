import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

/**
 * Auth0ProviderWithNavigate must live INSIDE BrowserRouter so it can call
 * useNavigate(). After Auth0 redirects back to this app, onRedirectCallback
 * fires and sends the user to /file-case (or wherever they intended to go).
 */
function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate()

  function onRedirectCallback(appState) {
    // appState.returnTo is set if you called loginWithRedirect({ appState: { returnTo: '/somewhere' } })
    // Default landing after login is /file-case
    navigate(appState?.returnTo || '/file-case', { replace: true })
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,   // just http://localhost:5173
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>,
)
