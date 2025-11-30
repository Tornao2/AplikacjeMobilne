import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { Accelerometer } from 'expo-sensors';
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/QuotesStyles";

import { API } from "../api";
export const QUOTES_ENDPOINT = API.QUOTES;

const SHAKE_THRESHOLD = 1.5; 
const DEBOUNCE_TIME = 1000; 

export default function QuotesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [quote, setQuote] = useState(null);
  const [visible, setVisible] = useState(false);
  const [lastShake, setLastShake] = useState(0); 

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch(QUOTES_ENDPOINT);
      const data = await response.json();

      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex]);
      }
    } catch (error) {
      console.error("Błąd pobierania cytatu:", error);
    }
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); 
    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z) - 1; 
      const now = Date.now();
      if (magnitude > SHAKE_THRESHOLD && now - lastShake > DEBOUNCE_TIME) {
        setLastShake(now);
        setVisible(true); 
        fetchRandomQuote();
      }
    });
    return () => subscription.remove();
  }, [lastShake, visible]);

  return (
    <View style={theme.fullyCenteredContainerStyle}> 
        {visible && quote ? (
            <View style={theme.fullyCenteredContainerStyle}>
                <Text style={styles.quote}>
                    "{quote.text}"
                </Text>
                <Text style={theme.basicTextStyle}>
                  "{quote.author}"
                </Text>
            </View>
        ) : (
          <View style = {theme.fullyCenteredContainerStyle}>
            <Text style={[theme.basicTextStyle, {fontSize: 300}]}>?</Text>
            <Text style={[theme.basicTextStyle]}>Potrząśnij telefonem, by zobaczyć cytat dnia!</Text>
          </View>
        )}
    </View>
  );
}