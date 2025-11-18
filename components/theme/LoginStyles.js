import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    Welcome: {
      ...theme.titleStyle,
      fontSize: 32,
      color: "#b0c222ff",
    },
  });
