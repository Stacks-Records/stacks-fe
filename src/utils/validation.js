// Extract the 11-char video ID from a YouTube URL, or null if it isn't a valid YouTube link.
export function getYouTubeVideoID(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = (url ?? '').match(regExp);
    return match ? match[1] : null;
}

export function isValidYouTubeURL(url) {
    return getYouTubeVideoID(url) !== null;
}

// Resolve true if the URL loads as an actual image, false otherwise (empty, dead, or non-image).
export function isImageReachable(url) {
    return new Promise((resolve) => {
        if (!url || url.trim() === '') return resolve(false);
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}
