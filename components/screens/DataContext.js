import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { API } from "../api";
export const LIST_ENDPOINT = API.LIST;

export const EXPENSE_CATEGORIES = [
  "Transport",
  "Jedzenie",
  "Mieszkanie",
  "Rozrywka",
  "Zakupy",
  "Zdrowie",
  "Edukacja",
  "Inne Wydatki",
];

export const INCOME_CATEGORIES = [
  "Praca",
  "Inwestycje",
  "Prezent",
  "Inne Dochody",
];

const DataContext = createContext();
export const useData = () => useContext(DataContext);
const getAuthHeaders = (token) => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
});
export const DataProvider = ({ children }) => {
  const { token, logout, user } = useAuth();
  const [dataSets, setDataSets] = useState({ list: [] });
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => { 
    if (!token || !user?.id) {
          setLoading(false);
          return;
        }
    try {
      const endpoint = LIST_ENDPOINT;
            const res = await fetch(endpoint, {
                headers: getAuthHeaders(token), 
            });
            if (res.status === 401) {
                console.error("Autoryzacja wygasła lub jest nieważna.");
                logout();
                return;
            }
            if (!res.ok) {
                throw new Error("Błąd podczas pobierania listy: " + res.status);
            }
            const data = await res.json();
            setDataSets({ list: data });
    } catch (err) {
      console.error("Fetch list error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout, user]);

  useEffect(() => {
        fetchList();
    }, [fetchList]);

  const addToList = useCallback(async (entry) => {
    if (!token || !user?.id) {
            console.error("Brak tokena lub ID, nie można dodać wpisu.");
            return; 
        }
        const entryWithUserId = {
            ...entry,
            user_id: user.id, 
        };
    try {
      const res = await fetch(LIST_ENDPOINT, {
        method: "POST",
        headers: getAuthHeaders(token), 
        body: JSON.stringify(entryWithUserId),
      });
      if (res.status === 401) {
          console.error("Autoryzacja wygasła lub jest nieważna podczas POST.");
          logout(); 
          return;
      }
      if (!res.ok) {
          throw new Error("Błąd podczas dodawania wpisu: " + res.status);
      }
      await res.json(); 
      await fetchList(); 
    } catch (err) {
      console.error("Add error:", err.message);
    }
  }, [fetchList, token, logout, user]); 

  const contextValue = useMemo(
    () => ({ 
      dataSets, 
      loading,
      fetchList,
      addToList 
    }),
    [dataSets, loading, addToList]
  );

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
