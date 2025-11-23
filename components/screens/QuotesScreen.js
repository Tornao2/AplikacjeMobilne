import { View, Text, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/QuotesStyles";

export default function QuotesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [visible, setVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => setVisible(true)}>
      <View style={theme.fullyCenteredContainerStyle}>
        {visible ? (
          <>
            <Text style={styles.quote}>
              &quot;Nie oszczędzaj tego, co zostaje po wszystkich wydatkach, lecz wydawaj,
              co zostaje po odłożeniu oszczędności.&quot;
            </Text>
            <Text style={theme.basicTextStyle}>Warren E. Buffett</Text>
          </>
        ) : (
          <View style = {theme.fullyCenteredContainerStyle}>
            <Text style={[theme.basicTextStyle, {fontSize: 300}]}>?</Text>
            <Text style={[theme.basicTextStyle]}>Naciśnij żeby pokazać cytat(potem doda się sensor)</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
