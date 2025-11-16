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
        backgroundColor: darkMode ? "#3d3b3bff" : "#f5f5f5",
        borderColor: darkMode ? "#555" : "#d3d3d3",
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        marginBottom: 12,
        marginHorizontal: 5,
      },
      button: {
        backgroundColor: darkMode ? "#444" : "#000",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 8,
        marginHorizontal: 5,
      },
      buttonText: { color: "#fff", fontWeight: "700" },
      statusBarStyle: darkMode ? "light-content" : "dark-content",
      containerStyle: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: darkMode ? "#000" : "#fff",
      },
      titleStyle: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 15,
        color: darkMode ? "#fff" : "#000",
      },
      basicTextStyle: {
        fontSize: 16,
        fontWeight: "600",
        color: darkMode ? "#fff" : "#000", 
      }
    };

  return (
    <ThemeContext.Provider value={{ theme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
