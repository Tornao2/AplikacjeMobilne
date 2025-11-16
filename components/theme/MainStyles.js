import {StyleSheet} from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingVertical: 40,
    },
    periodButtons: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 15,
    },
    periodButton: {
      borderWidth: 1,
      borderColor: theme.colors.text,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 14,
      marginHorizontal: 5,
    },
    periodText: {
      color: theme.colors.text,
      fontWeight: "600",
    },
    activePeriod: {
      backgroundColor: theme.colors.text,
    },
    activePeriodText: {
      color: theme.colors.background,
    },
    totalRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "90%",
      marginTop: 20,
    },
    totalText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    editButton: {
      backgroundColor: theme.colors.text,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    editButtonText: {
      color: theme.colors.background,
      fontWeight: "600",
    },
    listContainer: {
      width: "90%",
      marginTop: 20,
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    itemName: {
      flex: 1,
      fontWeight: "600",
      color: theme.colors.text,
    },
    itemPercent: {
      width: 60,
      textAlign: "center",
      color: theme.colors.text,
    },
    itemAmount: {
      width: 90,
      textAlign: "right",
      color: theme.colors.text,
    },
    pieChart: {
      marginVertical: 8,
    },
  });
