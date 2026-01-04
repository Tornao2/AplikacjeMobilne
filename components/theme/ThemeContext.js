import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  const theme = useMemo(() => {
    const colors = {
      background: darkMode ? "#000" : "#fff",
      lighterBackground: darkMode ? "#3d3b3bff" : "#f5f5f5",
      text: darkMode ? "#fff" : "#000",
      reverseText: darkMode ? "#000" : "#fff",
      border: darkMode ? "#555" : "#d3d3d3",
      primary: darkMode ? "#444" : "#000",
      selectedColor: "#D4AF37",
      buttonText: "#fff",
    };
    const containerBase = {
      flex: 1,
      padding: 5,
      backgroundColor: colors.background,
    };
    const sharedButtonProps = {
      padding: 8,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 15,
      marginHorizontal: 5,
    };

    return {
      darkMode,
      colors,
      statusBarStyle: darkMode ? "light-content" : "dark-content",
      containerStyle: { ...containerBase },
      centeredContainerStyle: { ...containerBase, alignItems: "center" },
      fullyCenteredContainerStyle: { ...containerBase, alignItems: "center", justifyContent: "center" },
      input: {
        backgroundColor: colors.lighterBackground,
        borderColor: colors.border,
        color: colors.text,
        placeholderTextColor: "#A9A9A9",
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        marginBottom: 15,
        marginHorizontal: 5,
      },
      button: { backgroundColor: colors.primary, ...sharedButtonProps },
      pressedButton: { backgroundColor: colors.selectedColor, ...sharedButtonProps },
      buttonText: { fontSize: 16, fontWeight: "600", color: colors.buttonText },
      titleStyle: { fontSize: 24, fontWeight: "700", marginBottom: 15, color: colors.text, textAlign: "center" },
      basicTextStyle: { fontSize: 16, fontWeight: "600", color: colors.text },
      smallTextStyle: { fontSize: 14, fontWeight: "400", color: colors.text },
      biggerTextStyle: { fontSize: 18, fontWeight: "600", color: colors.text },
      borders: { borderColor: colors.border, borderRadius: 8, borderWidth: 1, padding: 10, marginBottom: 10 },
      centeredRow: { alignItems: "center", justifyContent: "center", flexDirection: "row" },
      spacedOutRow: { alignItems: "center", justifyContent: "space-between", flexDirection: "row" },
      entryRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border, 
        paddingVertical: 8 
      },
      switchProps: {
        trackColor: {
          false: colors.border,
          true: colors.selectedColor,
        },
        thumbColor: darkMode ? colors.selectedColor : "#f4f3f4",
        ios_backgroundColor: colors.border,
      },
      categoryListContainer: {
        maxHeight: 200,
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
        borderColor: colors.border,
      },
      categoryListItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      columnItemContainer: { flexDirection: "column", flex: 1 },
      footer: { marginTop: "auto", alignItems: "center", paddingVertical: 12 },
      width90: { width: "90%" },
      width45: { width: "45%" },
      centered: { alignItems: "center" },
    };
  }, [darkMode]);
  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);