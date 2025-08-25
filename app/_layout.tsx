// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  // Layout global sin headers nativos
  return <Stack screenOptions={{ headerShown: false }} />;
}
