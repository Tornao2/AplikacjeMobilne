import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 15,
    },
    activeButton: { backgroundColor: theme.colors.backgroundColor },
    activeText: { ...theme.basicTextStyle },
    gallery: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    thumbnail: {
      width: 100,
      height: 100,
      borderRadius: theme.input.borderRadius,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "center",
    },
    modalContainer: {
      ...theme.containerStyle,
      alignItems: "center",
    },
    fullImage: {
      width: "90%",
      height: "75%",
    },
    closeArea: { ...StyleSheet.absoluteFillObject },
    deleteButton: {
      position: "absolute",
      bottom: 50,
      backgroundColor: "red",
      padding: 10,
      borderRadius: theme.input.borderRadius,
    },
  });
