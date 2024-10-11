import MyStackAlbum from './MyStackAlbum'
import MyStackContext from '../Context/MyStack'
import { Link } from 'react-router-dom'
import '../CSS/MyStackPage.css'
import { useContext } from 'react'
const MyStackPage = () => {
    const {myStack, setMyStack} = useContext(MyStackContext)

   function handleDelete(id) {
    const deleteFavorite = myStack.filter(record => record.id !== id)
    setMyStack(deleteFavorite)
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