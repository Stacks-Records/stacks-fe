import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../CSS/RecordPage.css';

function getYouTubeVideoID(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

const RecordPage = ({ records, addToStack }) => {
    const { id } = useParams();
    const record = records.find(record => record.id === id);


    if (!record) {
        return <p>Record not found.</p>;
    }

    const {
        albumName = 'N/A',
        artist = 'N/A',
        releaseDate = 'N/A',
        genre = 'N/A',
        bandMembers = [],
        label = 'N/A',
        isBandTogether = false,
        rollingStoneReview = 'N/A',
        youTubeAlbumURL = '',
        imgURL = '',
        albumsSold = 0
    } = record;

    const videoID = getYouTubeVideoID(youTubeAlbumURL)

    return (
        <div className="record-page">
            {youTubeAlbumURL && (
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoID}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}
            <div className="buttons-containter">
                <button onClick={() => addToStack(record)}>Add To My Stack</button>
            </div>
            <div className="image-container">
                <img src={imgURL} alt={`${albumName} cover`} />
                <div className="album-info">
                    <h1>{albumName}</h1>
                    <h2>{artist}</h2>
                    <p><strong>Release Date:</strong> {releaseDate}</p>
                    <p><strong>Genre:</strong> {genre}</p>
                    <p><strong>Band Members:</strong> {bandMembers.join(', ')}</p>
                    <p><strong>Label:</strong> {label}</p>
                    <p><strong>Band Status:</strong> {isBandTogether ? 'Together' : 'Disbanded'}</p>
                    <p><strong>Rolling Stone Review:</strong> {rollingStoneReview}</p>
                    <p><strong>Albums Sold:</strong> {albumsSold.toLocaleString()}</p>
                </div>
            </div>

        </div>
    );
};

RecordPage.propTypes = {
    records: PropTypes.arrayOf(
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
    addToStack: PropTypes.func.isRequired,
  };


export default RecordPage;
