import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import MainNavigator from "./src/navigators/MainNavigator";
import { LogBox } from "react-native"

if (__DEV__) {
  const ignoreErrors = ["Support for defaultProps will be removed"];

  const error = console.error;
  console.error = (...arg) => {
    for (const error of ignoreErrors) if (arg[0].includes(error)) return;
    error(...arg);
  };

  LogBox.ignoreLogs(ignoreErrors);
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Khand-Bold": require("./src/assets/fonts/Khand-Bold.ttf"),
    "Khand-Medium": require("./src/assets/fonts/Khand-Medium.ttf"),
    "Khand-Regular": require("./src/assets/fonts/Khand-Regular.ttf"),
    "Poppins-Bold": require("./src/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./src/assets/fonts/Poppins-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
