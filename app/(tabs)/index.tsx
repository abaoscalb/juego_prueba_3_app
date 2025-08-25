import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 👇 usa expo-av
import { ResizeMode, Video } from "expo-av";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Robot arriba (video) */}
        <Video
          source={require("../../assets/images/robot.mp4")}
          style={styles.robot}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
          isMuted
          // posterSource={require("../../assets/images/robot-poster.png")} // opcional: imagen de preload
        />

        {/* Título y bajada */}
        <Text style={styles.title}>Quiz Robot</Text>
        <Text style={styles.subtitle}>
          Poné a prueba tu conocimiento. ¡Sumá puntos y resolvé los desafíos!
        </Text>

        {/* Botón Play */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push("/(tabs)/levels")}
        >
          <Text style={styles.playText}>▶︎ PLAY</Text>
        </TouchableOpacity>

        {/* Acciones secundarias (opcionales)
        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push("/how-to-play")}>
            <Text style={styles.link}>Cómo jugar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/about")}>
            <Text style={styles.link}>Acerca de</Text>
          </TouchableOpacity>
        </View>
        */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffffff" },
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
robot: {
  width: "100%",     // ocupa el 100% del ancho disponible
  aspectRatio: 1,   // mantiene cuadrado
  maxWidth: 460,    // techo para tablets
  marginBottom: 8,
  borderRadius: 16,
},
title: { fontSize: 32, fontWeight: "800", color: "white", marginTop: 8 },
subtitle: { fontSize: 16, color: "#242527ff", textAlign: "center", marginTop: 8, marginBottom: 24 },
playButton: {
  backgroundColor: "#22c55e",
  paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  playText: { color: "white", fontWeight: "800", fontSize: 18, letterSpacing: 1 },
  row: { flexDirection: "row", gap: 18, marginTop: 18 },
  link: { color: "#93c5fd", fontWeight: "600" },
});
