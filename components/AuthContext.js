import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {API} from "./api"
export const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const res = await fetch(`${API.ACCOUNTS}/${parsedUser.id}`, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          if (res.ok) {
            setToken(storedToken);
            setUser(parsedUser);
          } else {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
          }
        }
      } catch (e) {
        console.error("Błąd weryfikacji sesji:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = useCallback(async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    try {
      const dataToStore = { 
        id: userData.id, 
        email: userData.email 
      };
      await SecureStore.setItemAsync('userToken', authToken);
      await SecureStore.setItemAsync('userData', JSON.stringify(dataToStore));
    } catch (e) {
      console.error("Błąd zapisu sesji:", e);
    }
  }, []);
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch (e) {
      console.error("Błąd czyszczenia sesji:", e);
    }
  }, []);
  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};