import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    thumbnail: {
      width: 100,
      height: 100,
      borderRadius: theme.input.borderRadius,
    },
    fullImage: {
      width: "90%",
      height: "75%",
    },
  });
