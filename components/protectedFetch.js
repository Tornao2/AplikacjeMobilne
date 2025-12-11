import { useAuth } from './AuthContext';

const useApi = () => {
    const { token } = useAuth(); 
    const authorizedFetch = (url, options = {}) => {
        if (!token) {
            return Promise.reject({ 
                status: 401, 
                message: "Brak tokena autoryzacji. Wymagane ponowne logowanie."
            });
        }
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        };
        return fetch(url, { ...options, headers });
    };

    return { authorizedFetch };
};
export default useApi;