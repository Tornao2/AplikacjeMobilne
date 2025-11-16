import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    themeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "80%",
    },
    input: {
      ...theme.input,
      width: "80%",
    },
    saveButton: {
      ...theme.button,
      width: "80%",
    },
  });
