import MyStackAlbum from './MyStackAlbum'
import MyStackContext from '../Context/MyStack'
import { Link } from 'react-router-dom'
import '../CSS/MyStackPage.css'
import { useContext, useEffect } from 'react'
import { deleteStack } from './APICalls'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuth0 } from '@auth0/auth0-react'
const MyStackPage = () => {
    const {myStack, setMyStack} = useContext(MyStackContext)
    const {albums, setAlbums} = useContext(AuthAlbumContext)
    const {authCode} = useContext(AuthAlbumContext)
    const {user} = useAuth0()

   function handleDelete(album) {
    const {email} = user
    deleteStack(email, album, authCode)
    .then(data => {
        if (data.user.mystack.length) {
            const myStackIndex = albums.findIndex(record => record.id === album.id)
            albums[myStackIndex].isAlbumInStack = false;
            setMyStack(data.user.mystack)
        }
        else {
            setMyStack([])
        }
       })
    .catch(err => console.log(err))
   }

    return (
        <div className="my-stack-gallery">
          <h1 className="my-stack-title"> My Stack </h1>

          {(myStack?.length > 0 && Array.isArray(myStack)) ? (
            <div className="my-stack-wrapper">{myStack.map(record => {
                return (
                    <MyStackAlbum
                    key={record.id}
                    album={record}
                    handleDelete={handleDelete}
                    />
                )
            })}
                <Link to="/landing" className="main-gallery-link">
                    <button className="back-to-main" >Go Pick Out Some More!</button>
                </Link>
            </div>
          ): (
            <div className="nav-wrap">
                <p> No records in your stack... </p> 
                <Link to="/landing" className="main-gallery-link">
                    <button className="back-to-main" >Go Pick Some Out!</button>
                </Link>
            </div>
          )
          }
        </div>
    )
}


export default MyStackPage