// Extract the 11-char video ID from a YouTube URL, or null if it isn't a valid YouTube link.
export function getYouTubeVideoID(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = (url ?? '').match(regExp);
    return match ? match[1] : null;
}

export function isValidYouTubeURL(url) {
    return getYouTubeVideoID(url) !== null;
}

// Convert a release date from whatever format the API returns (e.g. "September 12th, 1975")
// into the exact YYYY-MM-DD form <input type="date"> requires, or '' if it can't be parsed.
export function toDateInputValue(dateString) {
    if (!dateString) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString

    const parsed = new Date(dateString.replace(/(\d+)(st|nd|rd|th)/, '$1'))
    if (isNaN(parsed.getTime())) return ''

    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, '0')
    const day = String(parsed.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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
