import {StyleSheet} from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.containerStyle,
      alignItems: "center",
      padding: 0,
      paddingVertical: 10,
    },
    periodButtons: {
      flexDirection: "row",
      justifyContent: "center",
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
    },
    totalText: {
      ...theme.basicTextStyle,
      fontSize: 18,
    },
    listContainer: {
      width: "90%",
    },
    listItem: {
      flexDirection: "row",
      paddingVertical: 4,
    },
    itemName: {
      flex: 1,
      ...theme.basicTextStyle,
    },
    itemAmount: {
      ...theme.basicTextStyle,
      width: 90,
      textAlign: "right",
    },
    pieChart: {
      paddingLeft: 100,
      backgroundColor: 'transparent',
    }, 
  });
