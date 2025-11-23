import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const colorsTable = {
        background: darkMode ? "#000" : "#fff",
        lighterBackground: darkMode ? "#3d3b3bff" : "#f5f5f5",
        text: darkMode ? "#fff" : "#000",
        reverseText: darkMode  ? "#000" : "#fff",
        border: darkMode ? "#555" : "#d3d3d3",
        primary: darkMode ? "#444" : "#000",
        selectedColor: "#1a6524ff",
        buttonText: "#fff",
  }
  const theme = {
      darkMode,
      colors: {
        background: darkMode ? "#000" : "#fff",
        lighterBackground: darkMode ? "#3d3b3bff" : "#f5f5f5",
        text: darkMode ? "#fff" : "#000",
        reverseText: darkMode  ? "#000" : "#fff",
        border: darkMode ? "#555" : "#d3d3d3",
        primary: darkMode ? "#444" : "#000",
        selectedColor: "#1a6524ff",
        buttonText: "#fff",
      },
      input: {
        backgroundColor: colorsTable.lighterBackground,
        borderColor: colorsTable.border,
        color: colorsTable.text,
        placeholderTextColor: colorsTable.buttonText,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        marginBottom: 15,
        marginHorizontal: 5,
      },
      button: {
        backgroundColor: colorsTable.primary,
        fontWeight: "700",
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 5,
      },
      borders: {
        borderColor: colorsTable.border,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
      },
      pressedButton: {
        backgroundColor: colorsTable.selectedColor,
        fontWeight: "700",
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 5,
      },
      statusBarStyle: darkMode ? "light-content" : "dark-content",
      containerStyle: {
        flex: 1,
        padding: 5,
        backgroundColor: colorsTable.background,
      },
      centeredContainerStyle: {
        flex: 1,
        padding: 5,
        backgroundColor: colorsTable.background,
        alignItems: "center",
      },
      fullyCenteredContainerStyle: {
        flex: 1,
        padding: 5,
        backgroundColor: colorsTable.background,
        alignItems: "center",
        justifyContent: "center",
      },
      titleStyle: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 15,
        color: colorsTable.text,
        textAlign: "center", 
      },
      buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colorsTable.buttonText, 
      },
      basicTextStyle: {
        fontSize: 16,
        fontWeight: "600",
        color: colorsTable.text, 
      },
      biggerTextStyle: {
        fontSize: 18,
        fontWeight: "600",
        color: colorsTable.text, 
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
        paddingVertical: 12 
      },
      entryRow: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colorsTable.border,
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
