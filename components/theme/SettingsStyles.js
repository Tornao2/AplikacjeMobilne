import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.containerStyle
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 20,
      color: theme.colors.text,
    },
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
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    input: {
      ...theme.input,
      width: "80%",
      borderWidth: 1,
      marginBottom: 12,
    },
    saveButton: {
      ...theme.button,
      width: "80%",
    },
    saveButtonText: {
      ...theme.buttonText
    }
  });
