import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";


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

export const DataProvider = ({ children }) => {

  const [dataSets, setDataSets] = useState({ list: [] });
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const res = await fetch(LIST_ENDPOINT);
      const data = await res.json();
      setDataSets({ list: data });
    } catch (err) {
      console.log("Fetch list error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const addToList = useCallback(async (entry) => {
    try {
      const res = await fetch(LIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      await res.json();

      await fetchList();

    } catch (err) {
      console.log("Add error:", err);
    }
  }, [fetchList]);

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
