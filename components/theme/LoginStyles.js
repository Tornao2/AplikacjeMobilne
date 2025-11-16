import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    Welcome: {
      fontSize: 30,
      fontWeight: "800",
      marginBottom: 30,
      color: "gold",
      textAlign: "center",
      width: "90%",
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 30,
      color: theme.colors.text,
    },
    input: {
      width: "90%",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: 8,
      width: "90%",
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontWeight: "600",
    },
    link: {
      marginTop: 15,
      color: theme.colors.text,
      fontSize: 14,
    },
  });
