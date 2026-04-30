import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { initializeDatabase } from "@/src/database/DatabaseManager";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();
initializeDatabase();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#151B20" }} edges={["top"]}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
