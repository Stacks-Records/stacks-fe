import React from 'react'
import {useAuth0} from '@auth0/auth0-react'

const LoginButton = () => {
    const { isAuthenticated, loginWithRedirect} = useAuth0();
    // const login = async() => {
    //     const domain = process.env.REACT_APP_DOMAIN;
    //     const audience = process.env.REACT_APP_AUDIENCE
    //     const scope = "read:stacks"
    //     const clientId = process.env.REACT_APP_CLIENT_ID   
    //     const responseType = "code";
    //     const redirectUri = "http://localhost:3000/landing";

    //     const response = fetch(
    //         `https://${domain}/authorize?` +
    //         `audience=${audience}&` +
    //         `scope=${scope}&` +
    //         `response_type=${responseType}&` +
    //         `client_id=${clientId}&` +
    //         `redirect_uri=${redirectUri}`, {
    //             redirect: "manual"
    //         }
    //     )
    //     console.log(response)
    //     window.location.replace(response.url)
    // }
    return (
    !isAuthenticated && 
    <button className='auth_bttn' onClick={() => loginWithRedirect()}>Log In</button>);
}

export default LoginButton
