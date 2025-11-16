import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      ...theme.containerStyle,
    },
    quote: {
      fontSize: 20,
      fontStyle: "italic",
      textAlign: "center",
      color: theme.colors.text,
      marginBottom: 20,
      lineHeight: 28,
    },
    author: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
  });
