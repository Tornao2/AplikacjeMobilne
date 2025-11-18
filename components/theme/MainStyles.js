import {StyleSheet} from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    itemName: {
      flex: 1,
      ...theme.basicTextStyle,
    },
    itemAmount: {
      ...theme.basicTextStyle,
      width: 90,
      textAlign: "right",
    },
  });
