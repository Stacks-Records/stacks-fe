import React from 'react'
import {useAuth0} from '@auth0/auth0-react'

const LoginButton = () => {
    const { isAuthenticated, loginWithRedirect} = useAuth0();

    return (
    !isAuthenticated && 
    <button className='auth_bttn' onClick={() => loginWithRedirect()}>Log In</button>);
}

export default LoginButton
