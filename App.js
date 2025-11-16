import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ThemeProvider, useTheme } from "./components/theme/ThemeContext";

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

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
      }}
    >
      <Tab.Screen name="Główna" component={MainScreen} />
      <Tab.Screen name="Cytaty" component={QuotesScreen} />
      <Tab.Screen name="Galeria" component={GalleryScreen} />
      <Tab.Screen name="Historia" component={HistoryScreen} />
      <Tab.Screen name="Cele" component={GoalsScreen} />
      <Tab.Screen name="Ustawienia" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
