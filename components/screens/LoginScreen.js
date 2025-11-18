import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/LoginStyles";

//logowanie na sztywno

//  const handleSubmit = () => {
//    if (!isRegister) {
//      if (email === "admin@gmail.com" && password === "1234") {
//        navigation.replace("MainTabs");
//      } else {
//        alert("Niepoprawny email lub hasło!");
//      }
//    } else {
//      //API
//      alert("Konto utworzone! Możesz się zalogować.");
//      setIsRegister(false);
//    }
//  };

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    navigation.replace("MainTabs");
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
