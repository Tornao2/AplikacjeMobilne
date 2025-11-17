
import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.containerStyle,
    },
    filterRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 10,
      gap: 10,
    },
    filterButton: {
      ...theme.input,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    activeFilter: {
      backgroundColor: theme.colors.text,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingVertical: 10,
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      marginBottom: 10,
    },

    dateInputWrapper: {
      flex: 1,
      marginHorizontal: 5,
    },

    dateInput: {
      ...theme.input,
      width: "100%",
      marginBottom: 0,
    },

  });
