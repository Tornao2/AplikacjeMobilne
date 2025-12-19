import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Alert 
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; 
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GalleryStyles";
import { useAuth } from "../AuthContext";
import { API, LOCAL_IP } from "../api";
import useApi from "../protectedFetch"; 

export default function GalleryScreen() {
  const { theme } = useTheme();
  const { token } = useAuth();
  const styles = createStyles(theme);
  const { authorizedFetch } = useApi();
  const [selectedCategory, setSelectedCategory] = useState("Faktury");
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const [isTransferring, setIsTransferring] = useState(false); 
  const [images, setImages] = useState({ Faktury: [], Paragony: [], Wplaty: [] });

  const fetchPhotos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authorizedFetch(API.PHOTOS);
      const data = await res.json();   
      const grouped = data.reduce((acc, photo) => {
        const cat = photo.category;
        if (acc[cat]) {
          acc[cat].push({
            id: photo.id,
            uri: `${LOCAL_IP}${photo.url}`
          });
        }
        return acc;
      }, { Faktury: [], Paragony: [], Wplaty: [] });

      setImages(grouped);
    } catch (e) {
      console.error("Błąd pobierania zdjęć:", e);
    }
  }, [token, authorizedFetch]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const performAction = async (actionFn) => {
    try {
      await actionFn();
      fetchPhotos();
      setSelectedPhoto(null);
      setIsTransferring(false);
    } catch (e) {
      Alert.alert("Błąd", "Operacja nie powiodła się.");
    }
  };
  const handleCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Brak uprawnień", "Potrzebujemy dostępu do aparatu");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({ quality: 0.9, base64: true });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      performAction(() => authorizedFetch(API.PHOTOS, {
        method: "POST",
        body: JSON.stringify({
          category: selectedCategory,
          base64: result.assets[0].base64
        })
      }));
    } 
  };
  const TransferOptions = () => (
    <View style={theme.width90}>
      <Text style={[theme.biggerTextStyle, { marginBottom: 15, textAlign: "center" }]}>
        Przenieś do:
      </Text>
      <View style={theme.centeredRow}>
        {Object.keys(images)
          .filter((cat) => cat !== selectedCategory) 
          .map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[theme.button, { flex: 1, marginHorizontal: 4 }]} 
              onPress={() => performAction(() => authorizedFetch(`${API.PHOTOS}/${selectedPhoto.id}`, {
                method: "PATCH",
                body: JSON.stringify({ category: cat }),
              }))}
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
            <Text style={theme.buttonText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={[theme.centeredContainerStyle, { flexDirection: 'row', flexWrap: 'wrap', width: '100%' }]}>
        {images[selectedCategory].map((photo) => (
          <TouchableOpacity 
            activeOpacity={0.8} 
            key={photo.id} 
            onPress={() => setSelectedPhoto(photo)} 
            style={{ marginHorizontal: 4 }}
          >
            <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={theme.centeredRow}>
        <TouchableOpacity style={[theme.button, { flex: 1 }]} onPress={handleCapture}>
          <Text style={theme.buttonText}>Zrób zdjęcie</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={!!selectedPhoto} transparent animationType="fade">
        <View style={theme.centeredContainerStyle}>
          {isTransferring ? (
            <TransferOptions />
          ) : (
            <>
              <Image 
                source={{ uri: selectedPhoto ? selectedPhoto.uri : undefined }}
                style={styles.fullImage} 
                resizeMode="contain" 
              />
              <View style={[theme.spacedOutRow, theme.footer, theme.width90]}>
                <TouchableOpacity 
                  style={[theme.button, { flex: 1, marginRight: 8 }]} 
                  onPress={() => setIsTransferring(true)}
                >
                  <Text style={theme.buttonText}>Przenieś</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[theme.button,  { backgroundColor: "red", flex: 1 }]} 
                  onPress={() => {
                    Alert.alert("Usuń", "Czy na pewno?", [
                      { text: "Anuluj" },
                      { text: "Usuń", onPress: () => performAction(() => authorizedFetch(`${API.PHOTOS}/${selectedPhoto.id}`, { method: "DELETE" })) }
                    ]);
                  }}
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
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}