import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [redirecting, setRedirecting] = useState(false);

    if (isAuthenticated) return null;

    const handleClick = () => {
        setRedirecting(true);
        loginWithRedirect();
    };

    return (
        <button
            type='button'
            className='auth_bttn'
            onClick={handleClick}
            disabled={redirecting}
        >
            {redirecting ? 'Signing in…' : 'Sign in'}
        </button>
    );
}

export default LoginButton
