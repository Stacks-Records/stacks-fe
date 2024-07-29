import Album from './Record'
import { getRecords } from './APICalls'
import {useState, useEffect} from 'react'
import '../CSS/LandingPage.css'


function LandingPage() {
    const [albums, setAlbums] = useState([])
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('')
    const [filteredAlbums, setFilteredAlbums] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const records = await getRecords()
                        setAlbums(records)  
            } catch(error) {
                console.error(error)
                setError('Could not find your records. Please refresh.')
            }
        }
        fetchRecords()
    }, [])

    useEffect(() => {
        const filterAlbums = () => {
            let filtered = albums
            if (search) {
                filtered = filtered.filter(album => 
                    album.albumName.toLowerCase().includes(search.toLowerCase())
                )
            }
            if (genre) {
                filtered = filtered.filter(album => 
                    album.genre.toLowerCase() === genre.toLowerCase()
                )
            }
            setFilteredAlbums(filtered)
        }
        filterAlbums()
    }, [search, genre, albums])

    return (
        <div className="landing-page">
            <div className="filters">
               <input 
               type="text"
               placeholder="What would you like to listen to?"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               />
               <select
               value={genre}
               onChange={(e) => setGenre(e.target.value)}
               >
                    <option value="">All Genres</option>
                    <option value="Rock">Rock</option>
                    <option value="Pop">Pop</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Country">Country</option>
                    <option value="Folk">Folk </option>
                    <option value="Jazz">Jazz</option>
                    <option value="Classical">Classical</option>
                </select> 
            </div>
            <div className="album-list">
                {filteredAlbums.map(album => (
                    <Album key={album.id} album={album} />
                ))}
            </div>
        </div>
    )
}

export default LandingPage