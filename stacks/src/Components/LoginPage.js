import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton'
const LoginPage = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className='login-page'>
        <LogoutButton/> 
        <LoginButton />
    </div>
  )
}

export default LoginPage