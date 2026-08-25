import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton'
import { useNavigate } from 'react-router';
import { useEffect, useContext, useState } from 'react';
import { postUser } from './APICalls';
import AuthAlbumContext from '../Context/AuthAlbumContext';
import '../CSS/LoginPage.css'

const LoginPage = () => {
  const { isAuthenticated, isLoading, error, user, logout, loginWithRedirect } = useAuth0();
  const userName = user?.name
  const userEmail = user?.email
  const { authCode } = useContext(AuthAlbumContext)
  const navigate = useNavigate();
  const [showTrouble, setShowTrouble] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    document.title = 'Stacks Records';
  }, []);

  // Token acquisition + data loading now live in App.js. Once authenticated
  // and a token is available, register the user and head to the dashboard.
  // Depends on userName/userEmail, not the whole user object — useAuth0()
  // can hand out a new user object reference without the underlying profile
  // actually changing, which would otherwise risk re-firing this (and
  // double-creating the user record) before the navigate below unmounts it.
  useEffect(() => {
    if (isAuthenticated && authCode && userEmail) {
      postUser({ name: userName, email: userEmail }, authCode)
      navigate('/landing')
    }
  }, [isAuthenticated, authCode, userName, userEmail, navigate])

  // Auth0's hosted login screen already has its own "Forgot password?" link,
  // so "Try again" and "Forgot password?" are both just a fresh
  // loginWithRedirect() — no connection name/API config needed.
  const handleRedirectToLogin = (action) => {
    setPendingAction(action);
    loginWithRedirect();
  };

  // Clears Auth0's tenant-side SSO session cookie, independent of the SPA's
  // local isAuthenticated state (which is why LogoutButton, gated on
  // isAuthenticated, never renders here). This is the only reliable escape
  // hatch when a broken/unverified account keeps getting silently
  // re-authenticated via that lingering session.
  const handleSwitchAccount = () => {
    setPendingAction('switch');
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (isLoading) {
    return (
      <main className='login-page'>
        <div className='login-wrapper'>
          <h1>Stacks Records</h1>
          <p>Loading…</p>
        </div>
      </main>
    )
  }

  if (error) {
    // Heuristic only — the exact wording depends on this tenant's custom
    // Auth0 Action, so confirm against the real error text once reproduced.
    const reason = error.error_description || error.message || '';
    const isUnverified = /verify/i.test(reason);

    return (
      <main className='login-page'>
        <div className='login-wrapper' role='alert'>
          <h1>Sign-in problem</h1>
          <p className='login-error'>{error.message}</p>
          {isUnverified && (
            <p className='login-hint'>
              New accounts must have their email address verified.
            </p>
          )}
          <div className='login-actions'>
            <button
              type='button'
              className='login-option'
              onClick={() => handleRedirectToLogin('retry')}
              disabled={pendingAction !== null}
            >
              {pendingAction === 'retry' ? 'Retrying…' : 'Try again'}
            </button>
            <button
              type='button'
              className='login-option login-option--primary'
              onClick={handleSwitchAccount}
              disabled={pendingAction !== null}
            >
              {pendingAction === 'switch' ? 'Signing out…' : 'Log out & switch account'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='login-page'>
      <div className='login-wrapper'>
        <h1>Welcome to Stacks Records</h1>
        <LoginButton />
        {!isAuthenticated && (
          <div className='login-disclosure'>
            <button
              type='button'
              className='login-disclosure__toggle'
              onClick={() => setShowTrouble((prev) => !prev)}
              aria-expanded={showTrouble}
              aria-controls='login-trouble-panel'
            >
              Trouble logging in?
            </button>
            {showTrouble && (
              <div className='login-disclosure__panel' id='login-trouble-panel'>
                <button
                  type='button'
                  className='login-option'
                  onClick={() => handleRedirectToLogin('forgot')}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'forgot' ? 'Redirecting…' : 'Forgot password?'}
                </button>
                <button
                  type='button'
                  className='login-option'
                  onClick={handleSwitchAccount}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'switch' ? 'Signing out…' : 'Sign in with a different account'}
                </button>
              </div>
            )}
          </div>
        )}
        <p className='login-trust'>Secured by Auth0</p>
      </div>
    </main>
  )
}

export default LoginPage
