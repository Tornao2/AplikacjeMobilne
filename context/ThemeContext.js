import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const theme = {
    darkMode,
    colors: {
      background: darkMode ? "#1c1c1c" : "#fff",
      text: darkMode ? "#fff" : "#000",
      primary: "#007AFF",
      secondary: darkMode ? "#555" : "#f0f0f0",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
