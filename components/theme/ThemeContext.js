import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = {
      darkMode,
      colors: {
        background: darkMode ? "#000" : "#fff",
        text: darkMode ? "#fff" : "#000",
        border: darkMode ? "#555" : "#d3d3d3",
        primary: darkMode ? "#444" : "#000",
        buttonText: "#fff",
      },
      input: {
        background: darkMode ? "#111" : "#f5f5f5",
        color: darkMode ? "#fff" : "#000",
        placeholderColor: darkMode ? "#aaa" : "#555",
        borderColor: darkMode ? "#555" : "#d3d3d3",
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
      },
      button: {
        backgroundColor: darkMode ? "#444" : "#000",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
      },
      buttonText: { color: "#fff", fontWeight: "700" },
      statusBarStyle: darkMode ? "light-content" : "dark-content",
      containerStyle: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: darkMode ? "#000" : "#fff",
      },
    };

  return (
    <ThemeContext.Provider value={{ theme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
