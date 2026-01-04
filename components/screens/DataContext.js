import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../AuthContext";
import useApi from "../protectedFetch"; 
import { API } from "../api";

export const LIST_ENDPOINT = API.LIST;
export const EXPENSE_CATEGORIES = ["Transport", "Jedzenie", "Mieszkanie", "Rozrywka", "Zakupy", "Zdrowie", "Edukacja", "Inne Wydatki"];
export const INCOME_CATEGORIES = ["Praca", "Inwestycje", "Prezent", "Inne Dochody"];

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { authorizedFetch } = useApi();
  const [dataSets, setDataSets] = useState({ list: [] });
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authorizedFetch(LIST_ENDPOINT);
      const data = await res.json();
      setDataSets({ list: data });
    } catch (err) {
      console.error("Fetch list error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [token, authorizedFetch]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const addToList = useCallback(async (entry) => {
    try {
      const res = await authorizedFetch(LIST_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const newEntry = await res.json();
        setDataSets(prev => ({
          ...prev,
          list: [...prev.list, newEntry]
        }));
      }
    } catch (err) {
      console.error("Add error:", err.message);
    }
  }, [authorizedFetch]);

  const contextValue = useMemo(
    () => ({
      dataSets,
      loading,
      fetchList,
      addToList
    }),
    [dataSets, loading, fetchList, addToList]
  );

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};