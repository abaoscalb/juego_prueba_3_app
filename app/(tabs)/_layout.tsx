// app/(tabs)/_layout.tsx
import { Stack } from "expo-router";

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
