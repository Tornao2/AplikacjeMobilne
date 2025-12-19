import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, Switch, Alert,
  KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/SettingsStyles";
import { useAuth } from "../AuthContext";
import { API } from "../api";

export default function SettingsScreen() {
  const { theme, setDarkMode } = useTheme();
  const styles = createStyles(theme);
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", avatar: null });
  const [isSecure, setIsSecure] = useState(true);

  useEffect(() => {
    setForm({ email: "", password: "", avatar: user?.avatar || null });
  }, [user]);

  const updateUser = async (data) => {
    try {
      const res = await fetch(`${API.ACCOUNTS}/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        Alert.alert("Błąd", "Sesja wygasła.");
        return logout();
      }
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleCaptureAvatar = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Błąd", "Brak uprawnień do aparatu.");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, quality: 0.6, base64: true,
    });
    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const success = await updateUser({ avatar: base64Image });
      if (success) {
        setForm(prev => ({ ...prev, avatar: base64Image }));
        Alert.alert("Sukces", "Awatar zaktualizowany.");
      }
    }
  };

  const saveChanges = async () => {
    if (!form.email.includes("@")) return Alert.alert("Błąd", "Błędny e-mail.");
    if (user.email !== form.email.trim()) {
      Alert.alert("Błąd", "Nie można zweryfikować Twojej tożsamości.");
      return;
    }
    setLoading(true);
    const payload = { email: form.email.trim() };
    if (form.password) payload.haslo = form.password;
    const success = await updateUser(payload);
    if (success) {
      Alert.alert("Sukces", "Dane zapisane. Zaloguj się ponownie.");
      logout();
    } else {
      Alert.alert("Błąd", "Nie udało się zapisać zmian.");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[theme.centeredContainerStyle, { paddingVertical: 20 }]}>
        <Text style={theme.titleStyle}>Ustawienia</Text>
        <TouchableOpacity onPress={handleCaptureAvatar}>
          <Image source={form.avatar ? { uri: form.avatar } : require("../../assets/avatar.jpg")} style={styles.avatar} />
        </TouchableOpacity>
        <View style={[theme.spacedOutRow, theme.width90]}>
          <Text style={theme.basicTextStyle}>Motyw ciemny</Text>
          <Switch value={theme.darkMode} onValueChange={setDarkMode} />
        </View>
        <TextInput
          style={[theme.input, theme.width90]}
          value={form.email}
          onChangeText={(t) => setForm(p => ({ ...p, email: t }))}
          autoCapitalize="none"
          placeholder="Twój E-mail"
          placeholderTextColor={theme.colors.text}
        />
        <View style={[theme.input, theme.width90, { flexDirection: 'row', alignItems: 'center', padding: 0,paddingLeft: 4 }]}>
          <TextInput
            style={{ flex: 1, color: theme.colors.text }}
            placeholder="Nowe hasło"
            placeholderTextColor={theme.colors.text}
            secureTextEntry={isSecure}
            value={form.password}
            onChangeText={(t) => setForm(p => ({ ...p, password: t }))}
          />
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={{ padding: 10 }}>
            <Text style={{ fontSize: 12, color: theme.colors.text, fontWeight: 'bold' }}>
              {isSecure ? "POKAŻ" : "UKRYJ"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[theme.button, theme.width90, {opacity: loading ? 0.6 : 1 }]} 
          onPress={saveChanges} 
          disabled={loading}
        >
          <Text style={theme.buttonText}>{loading ? "Zapisywanie..." : "Zapisz zmiany"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[theme.button, theme.width90, { backgroundColor: '#ff4444' }]} onPress={logout}>
          <Text style={theme.buttonText}>Wyloguj</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}