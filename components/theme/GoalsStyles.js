import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    goalCard: {
      borderRadius: theme.input.borderRadius,
      padding: 10,
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
