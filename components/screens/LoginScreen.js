import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/LoginStyles";

export const API_BASE_URL = 'http://192.168.0.122:3000'; 
export const ACCOUNTS_ENDPOINT = `${API_BASE_URL}/accounts`;

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
    const styles = createStyles(theme);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${ACCOUNTS_ENDPOINT}?email=${email}`);
            if (!response.ok) {
                throw new Error("Błąd sieci podczas próby logowania.");
            }
            const accounts = await response.json();
            if (accounts.length === 1 && accounts[0].haslo === password) {
                navigation.replace("MainTabs");
            } else {
                Alert.alert("Błąd", "Niepoprawny email lub hasło!");
            }
        } catch (error) {
            console.error("Błąd logowania:", error);
            Alert.alert("Błąd", "Wystąpił problem z połączeniem z serwerem.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const checkResponse = await fetch(`${ACCOUNTS_ENDPOINT}?email=${email}`);
            const existingAccounts = await checkResponse.json();
            if (existingAccounts.length > 0) {
                Alert.alert("Błąd", "Konto z tym adresem email już istnieje!");
                setIsLoading(false);
                return;
            }
            const registerResponse = await fetch(ACCOUNTS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, haslo: password }), 
            });
            if (registerResponse.ok) {
                Alert.alert("Sukces", "Konto utworzone! Możesz się teraz zalogować.");
                setEmail("");
                setPassword("");
                setIsRegister(false); 
            } else {
                throw new Error("Błąd rejestracji na serwerze.");
            }
        } catch (error) {
            console.error("Błąd rejestracji:", error);
            Alert.alert("Błąd", "Nie udało się utworzyć konta. Sprawdź połączenie.");
        } finally {
            setIsLoading(false);
        }
    };
  const handleSubmit = () => {
        if (isLoading || email.trim() === "" || password.trim() === "") {
             Alert.alert("Błąd", "Uzupełnij email i hasło!");
             return;
        }
        if (isRegister) {
            handleRegister();
        } else {
            handleLogin();
        }
    };
  return (
    <View style={theme.fullyCenteredContainerStyle}>
      <Text style={[styles.Welcome, theme.width90]}>Witaj w aplikacji Kontrola wydatków</Text>
      <Text style={theme.titleStyle}>{isRegister ? "Rejestracja" : "Logowanie"}</Text>
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TextInput
        style={[theme.input, theme.width90]}
        placeholder="Hasło"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholderTextColor={theme.darkMode ? "#929292ff" : "#A9A9A9"}
      />
      <TouchableOpacity style={[theme.button, theme.width90]} onPress={handleSubmit}>
        <Text style={theme.buttonText}>
          {isRegister ? "Zarejestruj się" : "Zaloguj"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={theme.basicTextStyle}>
          {isRegister
            ? "Masz konto? Zaloguj się"
            : "Nie masz konta? Zarejestruj się"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
