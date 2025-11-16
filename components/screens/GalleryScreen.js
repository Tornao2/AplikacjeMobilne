import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, Alert } from "react-native";
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
    <View style={theme.containerStyle}>
      <Text style={theme.titleStyle}>Galeria</Text>

      <View style={styles.buttonsRow}>
        {Object.keys(categories).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[theme.input, selectedCategory === cat && styles.activeButton]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[theme.basicTextStyle, selectedCategory === cat && styles.activeText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.gallery}>
        {images[selectedCategory].map((img, idx) => (
          <TouchableOpacity key={idx} onPress={() => setSelectedImage(img)}>
            <Image source={img} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={theme.input} onPress={() => Alert.alert("Aparat", "Zrób zdjęcie i zapisz")}>
          <Text style={theme.basicTextStyle}>Zrób zdjęcie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={theme.input} onPress={() => setEditMode(!editMode)}>
          <Text style={theme.basicTextStyle}>{editMode ? "Gotowe" : "Edytuj"}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeArea} onPress={() => setSelectedImage(null)} />
          <Image source={selectedImage} style={styles.fullImage} resizeMode="contain" />
          {editMode && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(selectedImage)}>
              <Text style={theme.buttonText}>Usuń</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}
