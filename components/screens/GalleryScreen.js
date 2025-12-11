import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Alert, 
  Platform,
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; 
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/GalleryStyles";
import { useAuth } from "../AuthContext";
import { API , LOCAL_IP} from "../api";
export const PHOTOS_ENDPOINT = API.PHOTOS;

export default function GalleryScreen() {
  const { theme } = useTheme();
  const { token, logout } = useAuth();
  const styles = createStyles(theme);
  const [selectedCategory, setSelectedCategory] = useState("Faktury");
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const getAuthHeaders = (contentType = "application/json") => {
    const headers = {
        "Authorization": `Bearer ${token}`,
    };
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return headers;
};
  const [images, setImages] = useState({
    Faktury: [],
    Paragony: [],
    Wplaty: []
  });
  const [isTransferring, setIsTransferring] = useState(false); 
  const handleDelete = async () => {
    if (!selectedPhoto || !token) return;
    const deletePhoto = async () => {
        try {
            const res = await fetch(`${PHOTOS_ENDPOINT}/${selectedPhoto.id}`, {
                method: "DELETE",
                headers: getAuthHeaders(null),
            });
            if (res.status === 401) {
                Alert.alert("Błąd", "Sesja wygasła. Zaloguj się ponownie.");
                logout();
                return;
            }
            if (!res.ok && res.status !== 404) {
                 throw new Error(`Błąd usuwania: ${res.status}`);
            }
            fetchPhotos(); 
            setSelectedPhoto(null);           
        } catch (e) {
            console.error("Delete error:", e);
            Alert.alert("Błąd", "Nie udało się usunąć zdjęcia.");
        }
    };
    Alert.alert(
        "Potwierdź usunięcie",
        "Czy na pewno chcesz usunąć to zdjęcie?",
        [
            { text: "Anuluj", style: "cancel" },
            { text: "Usuń", onPress: deletePhoto, style: "destructive" },
        ]
    );
  };
  const handleTransfer = async (targetCategory) => {
    if (!selectedPhoto || !token) return;
    try {
        const res = await fetch(`${PHOTOS_ENDPOINT}/${selectedPhoto.id}`, {
            method: "PATCH",
            headers: getAuthHeaders(), 
            body: JSON.stringify({ category: targetCategory }),
        });    
        if (res.status === 401) {
            Alert.alert("Błąd", "Sesja wygasła. Zaloguj się ponownie.");
            logout();
            return;
        }
        if (!res.ok) {
            throw new Error(`Błąd przenoszenia: ${res.status}`);
        }
        fetchPhotos(); 
        setSelectedPhoto(null);
        setIsTransferring(false); 
    } catch (e) {
        console.error("Transfer error:", e);
        Alert.alert("Błąd", "Nie udało się przenieść zdjęcia.");
    }
  };
  const fetchPhotos = async () => {
    if (!token) { 
        setImages({ Faktury: [], Paragony: [], Wplaty: [] });
        return;
    }
    try {
      const res = await fetch(PHOTOS_ENDPOINT, {
        headers: getAuthHeaders(null), 
      });
      if (res.status === 401) {
        console.error("Brak autoryzacji podczas pobierania zdjęć.");
        logout();
        return;
      }
      if (!res.ok) {
        throw new Error(`Błąd pobierania: ${res.status}`);
      }
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
            uri: `${LOCAL_IP}${photo.url}`
          });
        }
      });
      setImages(grouped);
      setSelectedPhoto(null); 
    } catch (e) {
      console.error("fetch error", e);
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
      const capturedAsset = result.assets[0];
      let fileUri = capturedAsset.uri;
      if (Platform.OS === 'android' && fileUri.startsWith('file:////')) { 
        fileUri = fileUri.replace('file:////', 'file:///');
      }
      const finalFileName = `photo-${Date.now()}.jpg`; 
      const photoData = {
          url: finalFileName, 
          category: selectedCategory, 
          user_id: token,
          base64: capturedAsset.base64
      };
      try {
          const res = await fetch(PHOTOS_ENDPOINT, {
              method: "POST",
              headers: getAuthHeaders(), 
              body: JSON.stringify(photoData) 
          });   
          if (res.status === 401) {
              Alert.alert("Błąd", "Sesja wygasła podczas wysyłania zdjęcia. Zaloguj się ponownie.");
              logout();
              return;
          }    
          if (!res.ok) {
              const errorBody = await res.json().catch(() => ({ message: `Błąd wysyłania zdjęcia: ${res.status}` }));
              throw new Error(errorBody.message || `Błąd wysyłania zdjęcia: ${res.status}`);
          }      
          fetchPhotos();
      } catch (e) {
          console.error("Capture upload error:", e);
          Alert.alert("Błąd", "Wystąpił błąd podczas wysyłania zdjęcia.");
      }
    } 
};
  useEffect(() => {
    if (token) {
        fetchPhotos();
    } else {
        setImages({ Faktury: [], Paragony: [], Wplaty: [] });
    }
  }, [token]); 
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
            <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
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
              source={{ uri: selectedPhoto ? selectedPhoto.uri : undefined }}
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