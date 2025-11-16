import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.text,
    },
  });
