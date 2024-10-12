import MyStackAlbum from './MyStackAlbum'
import MyStackContext from '../Context/MyStack'
import { Link } from 'react-router-dom'
import '../CSS/MyStackPage.css'
import { useContext } from 'react'
import { deleteStack } from './APICalls'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuth0 } from '@auth0/auth0-react'
const MyStackPage = () => {
    const {myStack, setMyStack} = useContext(MyStackContext)
    const {authCode} = useContext(AuthAlbumContext)
    const {user} = useAuth0()

   function handleDelete(album) {
    const {email} = user
    deleteStack(email, album, authCode)
    .then(data => console.log(data))
    .catch(err => console.log(err))
   }
   if (myStack.length !== undefined) {
    var myStackRecords = myStack.map(record => {
        return (
            <MyStackAlbum
            key={record.id}
            album={record}
            handleDelete={handleDelete}
            />
        )
    })
   }
  
    return (
        <div className="my-stack-gallery">
          <h1 className="my-stack-title"> My Stack </h1>

          {myStackRecords.length > 0 ? (
            <div className="my-stack-wrapper">{myStackRecords}
             <button className="back-to-main">
                    <Link to="/landing" className="main-gallery-link">Go Pick Out Some More!</Link>
                </button>
            </div>
          ): (
            <div className="nav-wrap">
                <p> No records in your stack... </p> 
                <button className="back-to-main">
                    <Link to="/landing" className="main-gallery-link">Go Pick Some Out!</Link>
                </button>
            </div>
          )}
        </div>
    )
}


export default MyStackPage