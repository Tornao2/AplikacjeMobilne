import { View, Text } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/QuotesStyles";

export default function QuotesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>
        &quot;Nie oszczędzaj tego, co zostaje po wszystkich wydatkach, lecz wydawaj,
        co zostaje po odłożeniu oszczędności.&quot;
      </Text>
      <Text style={styles.author}>Warren E. Buffett</Text>
    </View>
  );
}
