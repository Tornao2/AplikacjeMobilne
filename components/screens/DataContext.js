import React, { createContext, useContext, useState, useMemo } from "react"; 

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

const initialList = [
  { name: "Artykuły spożywcze", amount: 500, color: "red", date: "2025-11-15", type: "Wydatki", category: "Jedzenie" },
  { name: "Transport", amount: 20, color: "green", date: "2025-10-15", type: "Wydatki", category: "Transport" },
  { name: "Kredyty", amount: 1200, color: "orange", date: "2025-01-15", type: "Wydatki", category: "Mieszkanie" },
  { name: "Wypłata", amount: 800, color: "purple", date: "2025-09-15", type: "Dochody", category: "Praca" },
  { name: "Transport", amount: 300, color: "blue", date: "2025-11-15", type: "Wydatki", category: "Transport" },
  { name: "Czynsz", amount: 1000, color: "pink", date: "2025-08-15", type: "Wydatki", category: "Mieszkanie" },
  { name: "Media", amount: 500, color: "yellow", date: "2025-01-15", type: "Wydatki", category: "Mieszkanie" },
  { name: "Rozrywka", amount: 300, color: "black", date: "2025-11-15", type: "Wydatki", category: "Rozrywka" },
  { name: "Prezent", amount: 500, color: "green", date: "2025-01-15", type: "Dochody", category: "Prezent" },
  { name: "Jedzenie", amount: 1000, color: "gray", date: "2025-11-15", type: "Wydatki", category: "Jedzenie" },
  { name: "Podróże", amount: 8000, color: "cyan", date: "2025-11-15", type: "Wydatki", category: "Inne Wydatki" },
];
const DataContext = createContext();
export const useData = () => useContext(DataContext);
export const DataProvider = ({ children }) => {
  const [dataSets, setDataSets] = useState({ list: initialList });
  const addToList = React.useCallback((entry) => {
    setDataSets(prev => ({
      ...prev,
      list: [entry, ...prev.list], 
    }));
  }, []); 
  const contextValue = useMemo(() => ({ 
    dataSets, 
    setDataSets, 
    addToList 
  }), [dataSets, addToList]); 
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};