import { useCallback } from 'react';
import { useAuth } from './AuthContext';

const useApi = () => {
    const { token, logout } = useAuth();
    const authorizedFetch = useCallback(async (url, options = {}) => {
        if (!token) {
            return Promise.reject({
                status: 401,
                message: "Brak tokena autoryzacji."
            });
        }
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
        try {
            const response = await fetch(url, { ...options, headers });
            if (response.status === 401) {
                if (logout) logout();
                throw new Error("Sesja wygasła. Zaloguj się ponownie.");
            }
            return response;
        } catch (error) {
            console.error("Błąd API:", error.message);
            throw error;
        }
    }, [token, logout]);
    return { authorizedFetch };
};

export default useApi;