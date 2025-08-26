// app/(tabs)/_layout.tsx
import { Stack } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  /\[expo-av\]: Expo AV has been deprecated/i,
  /Video component from `expo-av` is deprecated/i,
  /\[Reanimated\] Reduced motion setting is enabled/i,
]);

export default function GroupLayout() {
  // Sin barra de tabs: usamos Stack simple
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home */}
      <Stack.Screen name="index" />

      {/* Levels */}
      <Stack.Screen name="levels" />

      {/* (opcional) Explore: si no lo usás, podés borrar explore.tsx */}
      {/* <Stack.Screen name="explore" /> */}
    </Stack>
  );
}
