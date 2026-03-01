import { useState, useEffect } from 'react';

/**
 * useLocalStorage
 * A drop-in replacement for useState that persists its value in localStorage.
 *
 * @param {string}  key          - The localStorage key to use.
 * @param {*}       initialValue - Fallback value when nothing is stored yet.
 * @returns {[*, Function]}      - [storedValue, setValue] — identical API to useState.
 */
function useLocalStorage(key, initialValue) {
    // Lazy initialiser: read from localStorage on first render only.
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // If a value exists, parse it; otherwise fall back to the initial value.
            return item !== null ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`useLocalStorage: error reading key "${key}"`, error);
            return initialValue;
        }
    });

    // Sync to localStorage whenever the value changes.
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`useLocalStorage: error writing key "${key}"`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;
