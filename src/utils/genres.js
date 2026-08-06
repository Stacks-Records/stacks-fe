// Normalizes an album's genre data into a flat list of display names.
// `genres` (from GET /albums, /albums/:id) is an array of {name, isCanonical}
// objects; falls back to the legacy singular `genre` string when `genres`
// hasn't been populated.
export function genreName(genre) {
    return typeof genre === 'string' ? genre : genre.name
}

export function getAlbumGenreNames(genres, genre) {
    const list = (genres && genres.length > 0) ? genres : (genre && genre !== 'N/A' ? [genre] : [])
    return list.map(genreName)
}
