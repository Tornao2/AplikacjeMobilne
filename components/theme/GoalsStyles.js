import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.containerStyle,
      alignItems: "stretch",
    },
    title: {
      ...theme.titleStyle,
      textAlign: "center",
    },
    formButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    saveButton: {
      ...theme.button,
      flex: 1,
    },
    goalCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.input.borderRadius,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.input.borderColor,
    },
    progressBar: {
      height: 10,
      backgroundColor: theme.input.borderColor,
      borderRadius: theme.input.borderRadius / 2,
    },
    progressFill: {
      height: "100%",
      backgroundColor: "lime",
    },
    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
  });
