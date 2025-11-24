import { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Alert, 
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; 
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GalleryStyles";

let nextId = 100;
const generateId = () => `CAM-${nextId++}`;
const initialCategories = {
  Faktury: [
    { id: 'F1', uri: require("../../assets/faktura.jpg") },
  ],
  Paragony: [
    { id: 'P1', uri: require("../../assets/paragon.jpg") },
  ],
  Wpłaty: [
    { id: 'W1', uri: require("../../assets/wpłata.jpg") },
  ],
};

export default function GalleryScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedCategory, setSelectedCategory] = useState("Faktury");
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const [images, setImages] = useState(initialCategories);
  const [isTransferring, setIsTransferring] = useState(false); 
  const handleDelete = (photoToDelete) => {
    Alert.alert("Usuń zdjęcie", "Czy na pewno chcesz usunąć to zdjęcie?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => {
          setImages((prev) => ({
            ...prev,
            [selectedCategory]: prev[selectedCategory].filter((p) => p.id !== photoToDelete.id), 
          }));
          setSelectedPhoto(null);
          setIsTransferring(false); 
        },
      },
    ]);
  };
  const handleTransfer = (targetCategory) => {
    if (!selectedPhoto || selectedCategory === targetCategory) return;
    setImages((prev) => {
      const sourceList = prev[selectedCategory].filter((p) => p.id !== selectedPhoto.id); 
      const targetList = [...prev[targetCategory], selectedPhoto]; 
      return {
        ...prev,
        [selectedCategory]: sourceList,
        [targetCategory]: targetList,
      };
    });
    setSelectedCategory(targetCategory); 
    setSelectedPhoto(null);
    setIsTransferring(false);
  };
  const handleCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Brak uprawnień", 
        "Potrzebujemy dostępu do aparatu, aby zrobić zdjęcie!"
      );
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, 
      aspect: [4, 3],
      quality: 0.5, 
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = {
        id: generateId(),
        uri: { uri: result.assets[0].uri }, 
      };
      setImages(prev => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], newPhoto]
      }));
    }
  };
  const TransferOptions = () => (
    <View style = {theme.width90}>
      <Text style={[theme.biggerTextStyle, { marginBottom: 15, textAlign: "center" }]}>
        Przenieś do:
      </Text>
      <View style = {theme.centeredRow}>
      {Object.keys(images)
        .filter((cat) => cat !== selectedCategory) 
        .map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[theme.button, { flex: 1, marginHorizontal: 4 }]} 
            onPress={() => handleTransfer(cat)}
          >
            <Text style={theme.buttonText}>{cat}</Text>
          </TouchableOpacity>
        ))}
        </View>
      <TouchableOpacity
        style={[theme.button, theme.footer]}
        onPress={() => setIsTransferring(false)}
      >
        <Text style={theme.buttonText}>Anuluj</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={theme.centeredContainerStyle}>
      <Text style={theme.titleStyle}>Galeria</Text>
      <View style={theme.centeredRow}>
        {Object.keys(images).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[theme.button, selectedCategory === cat && theme.pressedButton, { flex: 1 }]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[theme.buttonText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={[theme.centeredContainerStyle, {flexDirection: 'row', flexWrap: 'wrap', width: '100%',}]}>
        {images[selectedCategory].map((photo) => (
          <TouchableOpacity 
            activeOpacity={0.8} 
            key={photo.id} 
            onPress={() => setSelectedPhoto(photo)} 
            style = {{marginHorizontal: 4}}
          >
            <Image source={photo.uri} style={styles.thumbnail} /> 
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={theme.centeredRow}>
        <TouchableOpacity 
            style={[theme.button, { flex: 1 }]} 
            onPress={handleCapture} 
        >
          <Text style={theme.buttonText}>Zrób zdjęcie</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={!!selectedPhoto} transparent animationType="fade">
        <View style={[theme.centeredContainerStyle]}>
          {isTransferring ? (<TransferOptions />) : ( <>
            <Image 
              source={selectedPhoto ? selectedPhoto.uri : null} 
              style={styles.fullImage} 
              resizeMode="contain" 
            />
            <View style={[theme.spacedOutRow, theme.footer, theme.width90]}>
              <TouchableOpacity 
                style={[theme.button, { backgroundColor: theme.colors.primary, flex: 1, marginRight: 8 }]} 
                onPress={() => setIsTransferring(true)}
              >
                <Text style={theme.buttonText}>Przenieś</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[theme.button, { backgroundColor: "red", flex: 1, marginRight: 8 }]} 
                onPress={() => handleDelete(selectedPhoto)}
              >
                <Text style={theme.buttonText}>Usuń</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={[theme.button, theme.footer, theme.width90]} 
                onPress={() => setSelectedPhoto(null)}
            >
                <Text style={theme.buttonText}>Powrót</Text>
            </TouchableOpacity>
          </>)}
        </View>
      </Modal>
    </View>
  );
}