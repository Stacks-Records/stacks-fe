import MyStackAlbum from './MyStackAlbum'
import MyStackContext from '../Context/MyStack'
import { Link } from 'react-router-dom'
import '../CSS/MyStackPage.css'
import { useContext, useEffect } from 'react'
import { deleteStack, getStackAlbums, reorderStack } from './APICalls'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import StackFilterContext from '../Context/StackFilterContext'
import { useAuth0 } from '@auth0/auth0-react'
import usePaginatedAlbums from '../hooks/usePaginatedAlbums'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'

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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    // MyStackContext's myStack is updated optimistically the moment an album
    // is added elsewhere (LandingPage), but stackResults is this component's
    // own independent fetch — nothing else keeps them in sync, so a freshly
    // added album can be missing here until a remount refetches it (e.g. if
    // that add's PATCH hadn't landed server-side yet when this page's own GET
    // fired). Once the full stack is loaded (hasMore false, so pagination
    // gaps can't be mistaken for a missing add) and we're not mid-filter,
    // reconcile: any id present in myStack but absent from stackResults is a
    // genuine addition and gets synced in directly.
    useEffect(() => {
        if (isFiltering || stackResults.loading || stackResults.hasMore) return
        const loadedIds = new Set(stackResults.albums.map(a => a.id))
        ;(myStack ?? []).forEach(album => {
            if (!loadedIds.has(album.id)) stackResults.addAlbum(album)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myStack, isFiltering, stackResults.loading, stackResults.hasMore, stackResults.albums, stackResults.addAlbum])

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

   function handleDragEnd(event) {
    const { active, over } = event
    if (isFiltering || !over || active.id === over.id) return

    const oldIndex = stackResults.albums.findIndex(a => a.id === active.id)
    const newIndex = stackResults.albums.findIndex(a => a.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    stackResults.reorderAlbums(oldIndex, newIndex)
    const newOrderIds = arrayMove(stackResults.albums, oldIndex, newIndex).map(a => a.id)

    reorderStack(newOrderIds, authCode)
    .then(data => {
        if (data?.user?.mystack) setMyStack(data.user.mystack)
    })
    .catch(err => {
        console.error('Failed to save new stack order:', err.message)
        alert('Could not save the new order. Please try again.')
        stackResults.reorderAlbums(newIndex, oldIndex)
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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={stackResults.albums.map(a => a.id)} strategy={rectSortingStrategy}>
                        {stackResults.albums.map(record => (
                            <MyStackAlbum
                            key={record.id}
                            album={record}
                            handleDelete={handleDelete}
                            dragDisabled={isFiltering}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
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