import MyStackAlbum from './MyStackAlbum'
import MyStackContext from '../Context/MyStack'
import { Link } from 'react-router-dom'
import '../CSS/MyStackPage.css'
import { useContext } from 'react'
import { deleteStack, getStackAlbums } from './APICalls'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import StackFilterContext from '../Context/StackFilterContext'
import { useAuth0 } from '@auth0/auth0-react'
import usePaginatedAlbums from '../hooks/usePaginatedAlbums'

const MyStackPage = () => {
    const {myStack, setMyStack} = useContext(MyStackContext)
    const {authCode} = useContext(AuthAlbumContext)
    const {user} = useAuth0()
    const { debouncedSearch, selectedGenres, selectedSort, sortOpt } = useContext(StackFilterContext)

    const isFiltering = debouncedSearch.trim().length > 0 || selectedGenres.length > 0 || selectedSort !== ''

    const stackResults = usePaginatedAlbums(authCode, {
        search: debouncedSearch,
        genre: selectedGenres,
        sortBy: sortOpt.sortBy,
        order: sortOpt.order,
        fetcher: getStackAlbums,
        enabled: true,
    })

   function handleDelete(album) {
    const {email} = user
    deleteStack(email, album, authCode)
    .then(data => {
        setMyStack(data.user.mystack)
        stackResults.removeAlbum(album.id)
    })
    .catch(err => {
        console.error('Failed to remove album from stack:', err.message)
        alert('Could not remove album from your stack. Please try again.')
    })
   }

    // Truly empty (no filter active) keeps today's exact copy, gated off the
    // context array so a brand-new user's empty state is unaffected by the
    // filtered-endpoint round trip above.
    if (!isFiltering && !(myStack?.length > 0 && Array.isArray(myStack))) {
        return (
            <div className="my-stack-gallery">
                <h1 className="my-stack-title"> My Stack </h1>
                <div className="nav-wrap">
                    <p> No records in your stack... </p>
                    <Link to="/landing" className="main-gallery-link">
                        <button className="back-to-main" >Go Pick Some Out!</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="my-stack-gallery">
          <h1 className="my-stack-title"> My Stack </h1>

          {stackResults.error && <p className="error-message">Error: {stackResults.error}</p>}
          {isFiltering && !stackResults.loading && !stackResults.error && stackResults.albums.length === 0 && (
            <p className="loading-message">No records match this search/filter.</p>
          )}

          {stackResults.albums.length > 0 && (
            <div className="my-stack-wrapper">
                {stackResults.albums.map(record => (
                    <MyStackAlbum
                    key={record.id}
                    album={record}
                    handleDelete={handleDelete}
                    />
                ))}
                <Link to="/landing" className="main-gallery-link">
                    <button className="back-to-main" >Go Pick Out Some More!</button>
                </Link>
            </div>
          )}
          {stackResults.loadingMore && <p className="loading-message">Loading more…</p>}
          {stackResults.hasMore && <div ref={stackResults.sentinelRef} className="grid-sentinel" />}
        </div>
    )
}


export default MyStackPage