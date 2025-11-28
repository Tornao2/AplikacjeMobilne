import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: { 
      ...theme.containerStyle,
      alignItems: "spread",
    },
    title: { 
      ...theme.titleStyle,
      textAlign: "center", 
    },
    switchRow: { 
      flexDirection: "row", 
      justifyContent: "center", 
    },
    activeSwitch: { 
      backgroundColor: theme.colors.backgroundColor 
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.input.borderColor,
      paddingVertical: 8,
    },
    footer: { 
      marginTop: "auto", 
      alignItems: "center", 
      paddingVertical: 15 
    },
  });
