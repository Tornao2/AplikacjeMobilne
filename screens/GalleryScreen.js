import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Alert } from "react-native";

export default function GalleryScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Faktury");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Obrazy „na sztywno” z folderów assets
  const categories = {
    Faktury: [
      require("../assets/faktura.jpg"),
    ],
    Paragony: [
      require("../assets/paragon.jpg"),
    ],
    Wpłaty: [
      require("../assets/wpłata.jpg"),
    ],
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
    <View style={styles.container}>
     <Text style={styles.title}>Galeria</Text>

      {/* Przełączanie kategorii */}
      <View style={styles.buttonsRow}>
        {["Faktury", "Paragony", "Wpłaty"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.activeButton,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.activeText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Miniaturki */}
      <ScrollView contentContainerStyle={styles.gallery}>
        {images[selectedCategory].map((img, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedImage(img)}>
            <Image source={img} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Przyciski akcji */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "black" }]}
          onPress={() => Alert.alert("Aparat", "zrób zdjęcie i zapisz")}
        >
          <Text style={styles.actionText}>Zrób zdjęcie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "black" }]}
          onPress={() => setEditMode(!editMode)}
        >
          <Text style={styles.actionText}>{editMode ? "Gotowe" : "Edytuj"}</Text>
        </TouchableOpacity>
      </View>

      {/* Podgląd zdjęcia */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeArea}
            onPress={() => setSelectedImage(null)}
          />
          <Image source={selectedImage} style={styles.fullImage} resizeMode="contain" />

          {editMode && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(selectedImage)}
            >
              <Text style={styles.deleteText}>Usuń</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 50, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  buttonsRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  categoryButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeButton: { backgroundColor: "black" },
  categoryText: { color: "dimgray", fontWeight: "600" }, // dark grey
  activeText: { color: "white" },
  gallery: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "darkgray ",
  },
  actions: { flexDirection: "row", marginTop: 20 },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionText: { color: "white", fontWeight: "600" },
  modalContainer: {
    flex: 1,
    //backgroundColor: "rgba(0,0,0,0.9)",// przeswitujący szary
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "90%", height: "75%", borderRadius: 10 },
  closeArea: { ...StyleSheet.absoluteFillObject },
  deleteButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },
  deleteText: { color: "white", fontWeight: "700" },
});
