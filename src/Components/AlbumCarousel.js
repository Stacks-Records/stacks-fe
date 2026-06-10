import Album from './Record'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

// Presentational coverflow carousel shared by the per-genre rows (GenreRow) and
// the browse results view, so the Swiper config lives in exactly one place.
function AlbumCarousel({ albums, addToStack, onAlbumDeleted }) {
    return (
        <Swiper
            modules={[EffectCoverflow, Navigation, Keyboard]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            keyboard={{ enabled: true }}
            navigation={true}
            coverflowEffect={{
                rotate: 80,
                stretch: 0,
                depth: 150,
                modifier: 1,
                slideShadows: true,
            }}
            className="album-carousel"
        >
            {albums.map(album => (
                <SwiperSlide key={album.id} className="album-slide">
                    <Album album={album} addToStack={addToStack} onAlbumDeleted={onAlbumDeleted}/>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default AlbumCarousel
