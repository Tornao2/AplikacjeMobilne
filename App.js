import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from '@expo/vector-icons';
import { DataProvider } from "./components/screens/DataContext";

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
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: theme.colors.text,
      }}
    >
      <Tab.Screen name="Główna" component={MainScreen}  options={{tabBarIcon: ({ size }) => (<MaterialIcons name="home"size={size}/>)}}/>
      <Tab.Screen name="Cytaty" component={QuotesScreen} options={{tabBarIcon: ({ size }) => (<MaterialIcons name="format-quote"size={size}/>)}}/>
      <Tab.Screen name="Galeria" component={GalleryScreen} options={{tabBarIcon: ({ size }) => (<MaterialIcons name="photo-library"size={size}/>)}}/>
      <Tab.Screen name="Historia" component={HistoryScreen} options={{tabBarIcon: ({ size }) => (<MaterialIcons name="history"size={size}/>)}}/>
      <Tab.Screen name="Cele" component={GoalsScreen} options={{tabBarIcon: ({ size }) => (<MaterialIcons name="flag"size={size}/>)}}/>
      <Tab.Screen name="Ustawienia" component={SettingsScreen} options={{tabBarIcon: ({ size }) => (<MaterialIcons name="settings"size={size}/>)}}/>
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
      <DataProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </DataProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
