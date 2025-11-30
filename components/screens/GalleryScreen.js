import { useState, useEffect } from "react";
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

//let nextId = 100;
//const generateId = () => `CAM-${nextId++}`;
// const initialCategories = {
//   Faktury: [
//     { id: 'F1', uri: require("../../assets/faktura.jpg") },
//   ],
//   Paragony: [
//     { id: 'P1', uri: require("../../assets/paragon.jpg") },
//   ],
//   Wplaty: [
//     { id: 'W1', uri: require("../../assets/wpłata.jpg") },
//   ],
// };

export default function GalleryScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedCategory, setSelectedCategory] = useState("Faktury");
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const [images, setImages] = useState({
    Faktury: [],
    Paragony: [],
    Wplaty: []
  });
  const [isTransferring, setIsTransferring] = useState(false); 
  const handleDelete = async () => {
    if (!selectedPhoto) return;

    await fetch(`http://192.168.0.122:3000/photos/${selectedPhoto.id}`, {
      method: "DELETE"
    });

    fetchPhotos();
  };
  const handleTransfer = async () => {
    if (!selectedPhoto) return;

    await fetch(`http://192.168.0.122:3000/photos/${selectedPhoto.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: targetCategory })
    });

    fetchPhotos();  
  };
  const fetchPhotos = async () => {
    try {
      const res = await fetch("http://192.168.0.122:3000/photos");
      const data = await res.json();

      const grouped = {
        Faktury: [],
        Paragony: [],
        Wplaty: []
      };

      data.forEach(photo => {
        if (grouped[photo.category]) {
          grouped[photo.category].push({
            id: photo.id,
            uri: { uri: `data:image/jpeg;base64,${photo.base64}` }
          });
        }
      });

      setImages(grouped);
      setSelectedPhoto(null);  // <── kluczowe
    } catch (e) {
      console.log("fetch error", e);
      setImages({
        Faktury: [],
        Paragony: [],
        Wplaty: []
      });
    }
  };
  const handleCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do aparatu");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoBase64 = result.assets[0].base64;

      const newPhoto = {
        //id: generateId(),
        category: selectedCategory,
        base64: photoBase64
      };

      await fetch("http://192.168.0.122:3000/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhoto)
      });

      fetchPhotos();
    }
  };
  useEffect(() => {
    fetchPhotos();
  }, []);
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