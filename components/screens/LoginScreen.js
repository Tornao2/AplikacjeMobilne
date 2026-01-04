import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/LoginStyles";
import { useAuth } from "../AuthContext";
import { API, LOCAL_IP } from "../api";

export const ACCOUNTS_ENDPOINT = API.ACCOUNTS;

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    const { email, password } = form;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      Alert.alert("Błąd", "Wprowadź poprawny email");
      return;
    }
    setIsLoading(true);
    try {
      if (isRegister) {
        const check = await fetch(`${ACCOUNTS_ENDPOINT}?email=${cleanEmail}`);
        const existing = await check.json();
        if (existing.length > 0) {
          Alert.alert("Błąd", "Konto z tym adresem email już istnieje!");
        } else {
          const res = await fetch(ACCOUNTS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: String(Date.now()),email: cleanEmail, haslo: password })
          });
          if (res.ok) {
            Alert.alert("Sukces", "Konto utworzone! Zaloguj się.");
            setIsRegister(false);
          }
        }
      } else {
        const response = await fetch(`${LOCAL_IP}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        if (response.ok) {
          const { user, token } = await response.json();
          login(user, token);
        } else {
          Alert.alert("Błąd", "Niepoprawne dane logowania.");
        }
      }
    } catch (error) {
      Alert.alert("Błąd", "Problem z połączeniem z serwerem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={theme.fullyCenteredContainerStyle}>
      <Text style={[styles.Welcome, theme.width90]}>Witaj w aplikacji Kontrola wydatków</Text>
      <Text style={theme.titleStyle}>{isRegister ? "Rejestracja" : "Logowanie"}</Text>
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(t) => updateForm("email", t)}
        placeholderTextColor={theme.darkMode ? "#929292" : "#A9A9A9"}
      />
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Hasło"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => updateForm("password", t)}
        placeholderTextColor={theme.darkMode ? "#929292" : "#A9A9A9"}
      />
      <TouchableOpacity 
        style={[theme.button, theme.width90, isLoading && { opacity: 0.7 }]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={theme.buttonText}>{isRegister ? "Zarejestruj się" : "Zaloguj"}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setIsRegister(!isRegister); setForm({ email: "", password: "" }); }}>
        <Text style={[theme.basicTextStyle]}>
          {isRegister ? "Masz konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}