import { View, Text } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createStyles } from "../theme/HistoryStyles";

export default function HistoryScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={theme.titleStyle}>Historia</Text>
    </View>
  );
}
