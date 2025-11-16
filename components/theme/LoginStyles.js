import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.containerStyle,
      justifyContent: "center",
    },
    Welcome: {
      ...theme.titleStyle,
      fontSize: 30,
      color: "#b0c222ff",
      textAlign: "center",
      width: "90%",
    },
    input: {
      ...theme.input,
      width: "90%",
    },
    button: {
      ...theme.button,
      width: "90%",
    },
  });
