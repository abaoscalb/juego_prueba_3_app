// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Sound } from "../lib/sound";

export default function RootLayout() {
  useEffect(() => {
    Sound.init(); // música de fondo arranca acá
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
