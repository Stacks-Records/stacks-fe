import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton'
import { useNavigate } from 'react-router';
import { useEffect, useContext } from 'react';
import { postUser } from './APICalls';
import AuthAlbumContext from '../Context/AuthAlbumContext';
import '../CSS/LoginPage.css'

const LoginPage = () => {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  const { authCode } = useContext(AuthAlbumContext)
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign in · Stacks Records';
  }, []);

  // Token acquisition + data loading now live in App.js. Once authenticated
  // and a token is available, register the user and head to the dashboard.
  useEffect(() => {
    if (isAuthenticated && authCode && user) {
      postUser(user, authCode)
      navigate('/landing')
    }
  }, [isAuthenticated, authCode, user, navigate])

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
    return (
      <main className='login-page'>
        <div className='login-wrapper' role='alert'>
          <h1>Sign-in problem</h1>
          <p className='login-error'>{error.message}</p>
        </div>
      </main>
    )
  }

  return (
    <main className='login-page'>
      <div className='login-wrapper'>
        <h1>Welcome to Stacks Records</h1>
        <LoginButton />
        <p className='login-trust'>Secured by Auth0</p>
      </div>
    </main>
  )
}

export default LoginPage
