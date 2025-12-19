import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text } from "react-native";
import { Accelerometer } from 'expo-sensors';
import { useTheme } from "../theme/ThemeContext";
import { API } from "../api";

const SHAKE_THRESHOLD = 2.0; 
const DEBOUNCE_TIME = 1500; 

export default function QuotesScreen() {
  const { theme } = useTheme();
  const [quotes, setQuotes] = useState([]); 
  const [currentQuote, setCurrentQuote] = useState(null);
  const lastShakeRef = useRef(0);

  useEffect(() => {
    fetch(API.QUOTES)
      .then(res => res.json())
      .then(data => setQuotes(data))
      .catch(err => console.error("Błąd:", err));
  }, []);

  const getDailyQuote = useCallback(() => {
    if (quotes.length > 0) {
      const dayOfYear = Math.floor(new Date() / 8.64e7);
      const dailyIndex = dayOfYear % quotes.length;
      setCurrentQuote(quotes[dailyIndex]);
    }
  }, [quotes]);

  useEffect(() => {
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.abs(x) + Math.abs(y) + Math.abs(z);
      const now = Date.now();
      if (acceleration > SHAKE_THRESHOLD && (now - lastShakeRef.current > DEBOUNCE_TIME)) {
        lastShakeRef.current = now;
        getDailyQuote();
      }
    });
    Accelerometer.setUpdateInterval(100);
    return () => sub.remove();
  }, [getDailyQuote]);

  return (
    <View style={theme.fullyCenteredContainerStyle}> 
      {currentQuote ? (
        <View style={[theme.fullyCenteredContainerStyle, { paddingHorizontal: 20 }]}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: theme.colors.text, textAlign: "center", fontStyle: 'italic' }}>
            "{currentQuote.text}"
          </Text>
          <Text style={[theme.basicTextStyle, { marginTop: 15, fontSize: 18 }]}>
            — {currentQuote.author}
          </Text>
        </View>
      ) : (
        <View style={theme.fullyCenteredContainerStyle}>
          <Text style={[theme.basicTextStyle, { fontSize: 200, fontWeight: 'bold' }]}>?</Text>
          <Text style={[theme.basicTextStyle, { textAlign: "center", width: '80%' }]}>
            Potrząśnij telefonem, by odkryć cytat dnia!
          </Text>
        </View>
      )}
    </View>
  );
}