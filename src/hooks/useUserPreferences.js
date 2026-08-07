import { useState, useEffect, useRef, useCallback } from 'react'
import { getUserPreferences, updateUserPreferences } from '../Components/APICalls'

const SAVE_DEBOUNCE_MS = 500

// Persists sort/filter/view-mode choices to the user_preferences table so
// they follow the user across devices. Saves are debounced (same pattern as
// the search-input debounce in LandingPage.js) since a genre multi-select can
// fire several updates in quick succession, and PUT is a full replace either
// way. Flushes on unmount so a change made right before navigating away isn't
// silently dropped by the debounce.
function useUserPreferences(email, token, defaults) {
    const [preferences, setPreferencesState] = useState(defaults)
    const saveTimeoutRef = useRef(null)
    const pendingSaveRef = useRef(null)

    useEffect(() => {
        if (!email || !token) return
        let active = true
        getUserPreferences(email, token)
            .then(saved => {
                if (active) setPreferencesState(prev => ({ ...prev, ...saved }))
            })
            .catch(err => console.log(err))
        return () => { active = false }
    }, [email, token])

    const flush = useCallback(() => {
        clearTimeout(saveTimeoutRef.current)
        if (pendingSaveRef.current && email && token) {
            updateUserPreferences(email, token, pendingSaveRef.current).catch(err => console.log(err))
            pendingSaveRef.current = null
        }
    }, [email, token])

    useEffect(() => flush, [flush])

    const setPreferences = useCallback((updates) => {
        setPreferencesState(prev => {
            const next = { ...prev, ...updates }
            pendingSaveRef.current = next
            clearTimeout(saveTimeoutRef.current)
            saveTimeoutRef.current = setTimeout(flush, SAVE_DEBOUNCE_MS)
            return next
        })
    }, [flush])

    return { preferences, setPreferences }
}

export default useUserPreferences
