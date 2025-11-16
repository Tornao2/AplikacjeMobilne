import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.colors.background, 
      padding: 20, 
      paddingTop: 40 
    },
    title: { 
      fontSize: 22, 
      fontWeight: "700", 
      textAlign: "center", 
      marginBottom: 20, 
      color: theme.colors.text 
    },
    switchRow: { 
      flexDirection: "row", 
      justifyContent: "center", 
      marginBottom: 20 
    },
    switchButton: {
      ...theme.input,
      paddingHorizontal: 25,
      marginHorizontal: 10,
    },
    switchText: { 
      color: theme.colors.text, 
      fontWeight: "600" 
    },
    activeSwitch: { 
      backgroundColor: theme.colors.primary 
    },
    activeSwitchText: { 
      color: theme.buttonText.color 
    },
    input: {
      ...theme.input,
      marginVertical: 10,
    },
    button: theme.button,
    buttonText: theme.buttonText,
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.input.borderColor,
      paddingVertical: 8,
    },
    itemText: { 
      fontSize: 16, 
      color: theme.colors.text 
    },
    itemType: { fontWeight: "600" },
    footer: { 
      marginTop: "auto", 
      alignItems: "center", 
      paddingVertical: 15 
    },
  });
