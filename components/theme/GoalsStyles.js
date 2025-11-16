import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
      paddingTop: 50,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 15,
      textAlign: "center",
      color: theme.colors.text,
    },

    addGoalButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.button.padding,
      borderRadius: theme.button.borderRadius,
      alignItems: theme.button.alignItems,
      marginBottom: 20,
    },

    addGoalButtonText: {
      color: theme.buttonText.color,
      fontWeight: theme.buttonText.fontWeight,
      fontSize: 16,
    },

    addContainer: {
      ...theme.input,
      padding: 15,
      marginBottom: 15,
    },

    input: {
      ...theme.input,
      marginVertical: 5,
    },

    formButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.button.padding,
      borderRadius: theme.button.borderRadius,
      alignItems: theme.button.alignItems,
      flex: 1,
      marginHorizontal: 4,
    },

    saveButtonText: {
      color: theme.buttonText.color,
      fontWeight: theme.buttonText.fontWeight,
    },

    scroll: {
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

    goalHeader: {
      marginBottom: 10,
    },

    goalName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },

    goalAmount: {
      color: theme.colors.text,
    },

    progressBar: {
      height: 10,
      backgroundColor: theme.input.borderColor,
      borderRadius: theme.input.borderRadius / 2,
      overflow: "hidden",
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
