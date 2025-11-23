import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, Alert, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GalleryStyles";

export default function GalleryScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [selectedCategory, setSelectedCategory] = useState("Faktury");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const categories = {
    Faktury: [require("../../assets/faktura.jpg")],
    Paragony: [require("../../assets/paragon.jpg")],
    Wpłaty: [require("../../assets/wpłata.jpg")],
  };
  const [images, setImages] = useState(categories);

  const handleDelete = (img) => {
    Alert.alert("Usuń zdjęcie", "Czy na pewno chcesz usunąć to zdjęcie?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => {
          setImages((prev) => ({
            ...prev,
            [selectedCategory]: prev[selectedCategory].filter((i) => i !== img),
          }));
          setSelectedImage(null);
        },
      },
    ]);
  };

  return (
    <View style={theme.centeredContainerStyle}>
      <Text style={theme.titleStyle}>Galeria</Text>
      <View style={theme.centeredRow}>
        {Object.keys(categories).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[theme.button, selectedCategory === cat && theme.pressedButton, {flex:1}]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[theme.buttonText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={theme.centeredRow}>
        {images[selectedCategory].map((img, idx) => (
          <TouchableOpacity activeOpacity={1} key={idx} onPress={() => setSelectedImage(img)}>
            <Image source={img} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={theme.centeredRow}>
        <TouchableOpacity style={[theme.button, {flex:1}]} onPress={() => Alert.alert("Aparat", "Zrób zdjęcie i zapisz")}>
          <Text style={theme.buttonText}>Zrób zdjęcie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[theme.button, editMode && theme.pressedButton, , {flex:1}]} onPress={() => setEditMode(!editMode)}>
          <Text style={[theme.buttonText]}>{editMode ? "Gotowe" : "Edytuj"}</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={theme.centeredContainerStyle}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setSelectedImage(null)} />
          <Image source={selectedImage} style={styles.fullImage} resizeMode="contain" />
          {editMode && (
            <View style={[theme.spacedOutRow, theme.footer, theme.width90]}>
              <TouchableOpacity style={[theme.button, {backgroundColor: "red", flex:1}]} onPress={() => handleDelete(selectedImage)}>
                <Text style={theme.buttonText}>Usuń</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[theme.button, {flex:1}]} onPress={() => setSelectedImage(null)}>
                <Text style={theme.buttonText}>Powrót</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
