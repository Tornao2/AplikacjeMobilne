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
    <View style={styles.container}>
      <Text style={styles.Welcome}>Witaj w aplikacji Kontrola wydatków</Text>
      <Text style={theme.titleStyle}>{isRegister ? "Rejestracja" : "Logowanie"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={theme.buttonText}>
          {isRegister ? "Zarejestruj się" : "Zaloguj"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.link}>
          {isRegister
            ? "Masz konto? Zaloguj się"
            : "Nie masz konta? Zarejestruj się"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
