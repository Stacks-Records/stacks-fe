import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton'
import Profile from './Profile';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { getToken } from './APICalls';
const LoginPage = () => {
  const { isAuthenticated } = useAuth0();
  
  return (
    <div className='login-page'>
        <LogoutButton/> 
        <LoginButton />
        <Profile/>
        {/* {isAuthenticated && useNavigate('/landing')} */}
    </div>
  )
}

export default LoginPage
