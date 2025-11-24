import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { Accelerometer } from 'expo-sensors';
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/QuotesStyles";

const SHAKE_THRESHOLD = 1.5; 
const DEBOUNCE_TIME = 1000; 

export default function QuotesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [visible, setVisible] = useState(false);
  const [lastShake, setLastShake] = useState(0); 

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); 
    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z) - 1; 
      const now = Date.now();
      if (!visible && magnitude > SHAKE_THRESHOLD && now - lastShake > DEBOUNCE_TIME) {
        setLastShake(now);
        setVisible(true); 
      }
    });
    return () => subscription.remove();
  }, [lastShake, visible]);

  return (
    <View style={theme.fullyCenteredContainerStyle}> 
        {visible ? (
            <View style={theme.fullyCenteredContainerStyle}>
                <Text style={styles.quote}>
                    &quot;Nie oszczędzaj tego, co zostaje po wszystkich wydatkach, lecz wydawaj,
                    co zostaje po odłożeniu oszczędności.&quot;
                </Text>
                <Text style={theme.basicTextStyle}>Warren E. Buffett</Text>
            </View>
        ) : (
          <View style = {theme.fullyCenteredContainerStyle}>
            <Text style={[theme.basicTextStyle, {fontSize: 300}]}>?</Text>
            <Text style={[theme.basicTextStyle]}>Potrząśnij telefonem, by zobaczyć cytat!</Text>
          </View>
        )}
    </View>
  );
}