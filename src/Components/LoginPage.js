import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton'
import { useNavigate } from 'react-router';
import { useEffect, useContext } from 'react';
import { getRecords, getStack, postUser } from './APICalls';
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext';
import '../CSS/LoginPage.css'

const LoginPage = () => {
  const { isAuthenticated, isLoading, error, getAccessTokenSilently, user } = useAuth0();
  const { setMyStack } = useContext(MyStackContext)
  const { setAlbums, authCode, setAuthCode } = useContext(AuthAlbumContext)
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign in · Stacks Records';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async () => {
        const token = await getAccessTokenSilently()
        setAuthCode(token)
        localStorage.setItem('authAccessToken', JSON.stringify(token))
      }
      getAccessToken()
    }
  }, [isAuthenticated, getAccessTokenSilently, setAuthCode])

  useEffect(() => {
    if (authCode && isAuthenticated) {
      const { email } = user
      postUser(user, authCode)

      const loadAndGo = async () => {
        try {
          const albums = await getRecords(authCode)
          setAlbums(albums)
          const data = await getStack(email, authCode)
          setMyStack(data[0]?.mystack ?? [])
        }
        catch (err) {
          console.log(err)
        }
        navigate('/landing')
      }

      loadAndGo()
    }
  }, [authCode, isAuthenticated, user, setAlbums, setMyStack, navigate])

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
