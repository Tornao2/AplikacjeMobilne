import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


//logowanie na sztywno

//  const handleSubmit = () => {
//    if (!isRegister) {
//      if (email === "admin" && password === "1234") {
//        navigation.replace("MainTabs");
//      } else {
//        alert("Niepoprawny login lub hasło!");
//      }
//    } else {
//      //API
//      alert("Konto utworzone! Możesz się zalogować.");
//      setIsRegister(false);
//    }
//  };


  const handleSubmit = () => {
    navigation.replace("MainTabs");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Welcome}>Witaj w aplikacji Kontrola wydatków</Text>
      <Text style={styles.title}>{isRegister ? "Rejestracja" : "Logowanie"}</Text>

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
        <Text style={styles.buttonText}>
          {isRegister ? "Zarejestruj się" : "Zaloguj"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.link}>
          {isRegister ? "Masz konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Welcome: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 30,
    color: '#007AFF',
    textAlign: 'center',
    width: '90%',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
  },

  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#4ade80',
    padding: 14,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  link: {
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
  },
});
