import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [dataSets, setDataSets] = useState({
    list: [
      { name: "Artykuły spożywcze", amount: 500, color: "red", date: "2025-11-15" },
      { name: "Transport", amount: 20, color: "green", date: "2025-10-15" },
      { name: "Kredyty", amount: 1200, color: "orange", date: "2025-01-15" },
      { name: "Leasingi", amount: 800, color: "purple", date: "2025-09-15" },
      { name: "Transport", amount: 300, color: "blue", date: "2025-11-15" },
      { name: "Czynsz", amount: 1000, color: "pink", date: "2025-08-15" },
      { name: "Media", amount: 500, color: "yellow", date: "2025-01-15" },
      { name: "Rozrywka", amount: 300, color: "black", date: "2025-11-15" },
      { name: "Oszczędności", amount: 500, color: "green", date: "2025-01-15" },
      { name: "Wynajem", amount: 1000, color: "gray", date: "2025-11-15" },
      { name: "Podróże", amount: 8000, color: "cyan", date: "2025-11-15" },
    ],
  });

  const addToList = (entry) => {
    setDataSets(prev => ({
      ...prev,
      list: [...prev.list, entry],
    }));
  };

  return (
    <DataContext.Provider value={{ dataSets, setDataSets, addToList }}>
      {children}
    </DataContext.Provider>
  );
};
