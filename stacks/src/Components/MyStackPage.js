import Album from './Record'
import { useStack } from './MyStack'
import PropTypes from 'prop-types'
// import Link from 'react-router-dom'

const MyStack = () => {
    const { myStack } = useStack()

    // const handleDelete = (id) => {
    //     myStack.filter(record => record.id !== id)
    // } 

    return (
        <div>
            <h1>My Stack</h1>
            {!myStack.length ? (
                <p>No albums in your stack... yet.</p>
            ) : (
                myStack.map((album) => <Album key={album.id} album={album} addToStack={() => {}} />)
            )}
        </div>
    )
}

MyStack.propTypes = {
    myStack: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            albumName: PropTypes.string.isRequired,
            artist: PropTypes.string.isRequired,
            releaseDate: PropTypes.string,
            genre: PropTypes.string.isRequired,
            bandMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
            label: PropTypes.string.isRequired,
            isBandTogether: PropTypes.bool.isRequired,
            rollingStoneReview: PropTypes.string,
            youTubeAlbumURL: PropTypes.string.isRequired,
            imgURL: PropTypes.string.isRequired,
            albumsSold: PropTypes.number
        })
    ).isRequired,
}

export default MyStack 