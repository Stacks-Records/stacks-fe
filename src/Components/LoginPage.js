import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton'
import Profile from './Profile';
import { useNavigate } from 'react-router';
import { useEffect,useContext } from 'react';
import { getRecords, getUsers, postUser} from './APICalls';
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext';
const LoginPage = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const {myStack, setMyStack} = useContext(MyStackContext)
  const {albums, setAlbums, authCode, setAuthCode} = useContext(AuthAlbumContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async() => {
        var token = await getAccessTokenSilently()
        setAuthCode(token)
      }
      getAccessToken()
    }
  },[isAuthenticated])
  useEffect(() => {
    if (authCode && isAuthenticated) {
      postUser(user, authCode)
      const getAlbums = async() => {
        try {
          const albums = await getRecords(authCode)
          setAlbums(albums)
        }
        catch (error) {
          console.log(error)
        }
      }
      getAlbums()
      navigate('/landing')
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
