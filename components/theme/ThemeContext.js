import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const colors = {
    background: darkMode ? "#000" : "#fff",
    lighterBackground: darkMode ? "#3d3b3bff" : "#f5f5f5",
    text: darkMode ? "#fff" : "#000",
    reverseText: darkMode ? "#000" : "#fff",
    border: darkMode ? "#555" : "#d3d3d3",
    primary: darkMode ? "#444" : "#000", 
    selectedColor: "#0f4917ff", 
    buttonText: "#fff", 
  };
  const { 
    background, lighterBackground, text, border, primary, selectedColor, buttonText 
  } = colors;
  const containerBase = {
      flex: 1,
      padding: 5,
      backgroundColor: background,
  };
  const sharedButtonProps = {
    fontWeight: "700",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 5,
  };
  const theme = {
    darkMode,
    colors, 
    input: {
      backgroundColor: lighterBackground,
      borderColor: border,
      color: text,
      placeholderTextColor: "#A9A9A9", 
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      marginBottom: 15,
      marginHorizontal: 5,
    },
    button: {
      backgroundColor: primary,
      ...sharedButtonProps, 
    },
    pressedButton: {
      backgroundColor: selectedColor, 
      ...sharedButtonProps, 
    },
    borders: {
      borderColor: border,
      borderRadius: 8,
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
    },
    statusBarStyle: darkMode ? "light-content" : "dark-content",
    containerStyle: {
      ...containerBase
    },
    centeredContainerStyle: {
      ...containerBase,
      alignItems: "center",
    },
    fullyCenteredContainerStyle: {
      ...containerBase,
      alignItems: "center",
      justifyContent: "center",
    },
    titleStyle: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 15,
      color: text,
      textAlign: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: buttonText,
    },
    basicTextStyle: {
      fontSize: 16,
      fontWeight: "600",
      color: text,
    },
    biggerTextStyle: {
      fontSize: 18,
      fontWeight: "600",
      color: text,
    },
    width90: {
      width: "90%",
    },
    width45: {
      width: "45%",
    },
    centeredRow: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    spacedOutRow: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    centered: {
      alignItems: "center",
    },
    footer: {
      marginTop: "auto",
      alignItems: "center",
      paddingVertical: 12,
    },
    entryRow: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: border,
      paddingVertical: 8,
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);