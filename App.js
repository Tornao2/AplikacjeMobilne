import { StatusBar, StyleSheet, View } from "react-native";
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
const GlowIcon = ({ name, size, focused, theme }) => {
  let iconColor;
  if (focused) {
    iconColor = "green"; 
  } else {
    iconColor = theme.darkMode ? "#E0E0E0" : "#555555";
  }
  return (
    <View>
      <MaterialIcons 
        name={name} 
        size={size} 
        color={iconColor} 
      />
    </View>
  );
};

function MainTabs() {
  const { theme } = useTheme();
  const renderTabIcon = (name, props) => (
    <GlowIcon 
      name={name} 
      size={props.size} 
      focused={props.focused} 
      theme={theme} 
    />
  );
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: theme.colors.text,
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.background},
      }}
    >
      <Tab.Screen 
        name="Główna" 
        component={MainScreen}  
        options={{ tabBarIcon: (props) => renderTabIcon("home", props) }}
      />
      <Tab.Screen 
        name="Cytaty" 
        component={QuotesScreen} 
        options={{ tabBarIcon: (props) => renderTabIcon("format-quote", props) }}
      />
      <Tab.Screen 
        name="Galeria" 
        component={GalleryScreen} 
        options={{ tabBarIcon: (props) => renderTabIcon("photo-library", props) }}
      />
      <Tab.Screen 
        name="Historia" 
        component={HistoryScreen} 
        options={{ tabBarIcon: (props) => renderTabIcon("history", props) }}
      />
      <Tab.Screen 
        name="Cele" 
        component={GoalsScreen} 
        options={{ tabBarIcon: (props) => renderTabIcon("flag", props) }}
      />
      <Tab.Screen 
        name="Ustawienia" 
        component={SettingsScreen} 
        options={{ tabBarIcon: (props) => renderTabIcon("settings", props) }}
      />
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