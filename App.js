import { StatusBar, StyleSheet, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from "./components/theme/ThemeContext";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { DataProvider } from "./components/screens/DataContext";
import LoginScreen from "./components/screens/LoginScreen";
import MainScreen from "./components/screens/MainScreen";
import QuotesScreen from "./components/screens/QuotesScreen";
import GalleryScreen from "./components/screens/GalleryScreen";
import HistoryScreen from "./components/screens/HistoryScreen";
import GoalsScreen from "./components/screens/GoalsScreen";
import SettingsScreen from "./components/screens/SettingsScreen";
import EditScreen from "./components/screens/EditScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screen = (name, component, icon) => ({
  name, component, 
  options: { tabBarIcon: ({ color, size }) => <MaterialIcons name={icon} size={size} color={color} /> }
});

function MainTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: theme.darkMode ? "#E0E0E0" : "#555",
        tabBarStyle: { 
          backgroundColor: theme.colors.background,
          borderTopColor: theme.darkMode ? "#333" : "#DDD" 
        },
      }}
    >
      <Tab.Screen {...screen("Główna", MainScreen, "home")} />
      <Tab.Screen {...screen("Cytaty", QuotesScreen, "format-quote")} />
      <Tab.Screen {...screen("Galeria", GalleryScreen, "photo-library")} />
      <Tab.Screen {...screen("Historia", HistoryScreen, "history")} />
      <Tab.Screen {...screen("Cele", GoalsScreen, "flag")} />
      <Tab.Screen {...screen("Ustawienia", SettingsScreen, "settings")} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Edit" component={EditScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });