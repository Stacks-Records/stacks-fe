import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton'
import Profile from './Profile';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { getRecords, getToken } from './APICalls';
import { useStack } from './MyStack'
const LoginPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [authCode, setAuthCode, albums, setAlbums] = useStack();
  useEffect(() => {

    const getAccessToken = async() => {
      var token = await getAccessTokenSilently()
      setAuthCode(token)
    }
    getAccessToken()
  },[isAuthenticated])
  useEffect(() => {
    if (authCode) {
      getRecords(authCode)
      .then(data => setAlbums(data))
      .catch(err => {
        console.log(err)
      })
    }
  },[authCode])
  return (
    <div className='login-page'>
        <LogoutButton/> 
        <LoginButton />
        <Profile/>
    </div>
  )
}

export default LoginPage
