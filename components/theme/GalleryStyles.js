import { StyleSheet } from "react-native";

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.containerStyle,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 15,
      color: theme.colors.text,
    },
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 15,
    },
    categoryButton: {
      ...theme.input,
      paddingHorizontal: 16,
      marginHorizontal: 8,
      alignItems: "center",
    },
    activeButton: { backgroundColor: theme.colors.primary },
    categoryText: { color: theme.colors.text, fontWeight: "600" },
    activeText: { color: theme.buttonText.color },
    gallery: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    thumbnail: {
      width: 100,
      height: 100,
      borderRadius: theme.input.borderRadius,
      borderWidth: 1,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "center",
    },
    actionButton: {
      ...theme.button,
      marginHorizontal: 8,
      marginBottom: 15,
    },
    actionText: theme.buttonText,
    modalContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
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
    deleteText: { ...theme.buttonText },
  });
