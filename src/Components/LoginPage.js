import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton'
import Profile from './Profile';
import { useNavigate } from 'react-router';
import { useEffect,useContext } from 'react';
import { getRecords, getStack, postUser} from './APICalls';
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext';
import '../CSS/LoginPage.css'
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
        localStorage.setItem('authAccessToken',JSON.stringify(token))
      }
      getAccessToken()
    }
  },[isAuthenticated])
  useEffect(() => {
    if (authCode && isAuthenticated) {
      const {email} = user
      postUser(user, authCode)

      const getAlbums = async() => {
        try {
          const albums = await getRecords(authCode)
          getStack(email, authCode)
          .then(data => {
            setMyStack(data[0].mystack)
            const userAlbums = albums.map(album => {
              const foundRecord = data[0].mystack.find(record => record.id === album.id)
              if (foundRecord) {
                return {...album,isAlbumInStack: true}
              }
              else {
                return {...album,isAlbumInStack: false}
              }
            })
            setAlbums(userAlbums)
          })
        }
        catch (error) {
          console.log(error)
        }
      }
      
      getAlbums()
      setTimeout(() => {
        navigate('/landing')
      },1000)
      
    }
  },[authCode])

  return (
    <div className='login-page'>
        <div className='login-wrapper'>
          <h1>Welcome to Stacks Records!</h1>
          <p>Login below to unlock our vinyl vault.</p>
          <LoginButton />
        </div>
        {/* {isAuthenticated && useNavigate('/landing')} */}
    </div>
  )
}

export default LoginPage
