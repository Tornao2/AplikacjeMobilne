import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    quote: {
      fontSize: 20,
      fontStyle: "italic",
      textAlign: "center",
      color: theme.colors.text,
      marginBottom: 20,
      lineHeight: 28,
    },
  });
