import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  InteractionManager,
  Platform,
  StatusBar as RNStatusBar,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Sound } from "../../lib/sound";

export default function HomeScreen() {
  const [muted, setMuted] = useState(Sound.muted);
  const [sfxMuted, setSfxMuted] = useState(Sound.sfxMuted);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setShowVideo(true));
    // @ts-ignore
    return () => task?.cancel?.();
  }, []);

  const handlePlay = () => {
    Sound.play("tap"); // no bloquea
    router.push("/levels");
  };

  const toggleMusic = async () => {
    await Sound.toggleMuted();
    setMuted(Sound.muted);
    Sound.play("tap");
  };

  const toggleSfx = () => {
    if (!Sound.sfxMuted) Sound.play("tap");
    Sound.toggleSfxMuted();
    setSfxMuted(Sound.sfxMuted);
    if (!Sound.sfxMuted) Sound.play("tap");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Robot arriba (video) */}
        <View style={styles.robotWrap} pointerEvents="none" collapsable={false}>
          {showVideo ? (
            <Video
              source={require("../../assets/images/robot.mp4")} // o ../../assets/robot1.mp4
              style={styles.robot}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay
              isMuted
              pointerEvents="none"
            />
          ) : (
            <View style={styles.robotPlaceholder} />
          )}
        </View>

        {/* Título y bajada */}
        <Text style={styles.title}>Quiz Robot</Text>
        <Text style={styles.subtitle}>
          Poné a prueba tu conocimiento. ¡Sumá puntos y resolvé los desafíos!
        </Text>

        {/* Botón Play */}
        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <Text style={styles.playText}>▶︎ PLAY</Text>
        </TouchableOpacity>

        {/* Botones de audio */}
        <TouchableOpacity style={styles.muteBtn} onPress={toggleMusic}>
          <Text style={styles.muteText}>
            {muted ? "Activar música" : "Silenciar música"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.muteBtn, { marginTop: 8 }]} onPress={toggleSfx}>
          <Text style={styles.muteText}>
            {sfxMuted ? "Activar efectos" : "Silenciar efectos"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight ?? 0 : 0,
  },
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },

  robotWrap: { alignSelf: "stretch", pointerEvents: "none" },
  robot: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 460,
    marginBottom: 8,
    borderRadius: 16,
  },
  robotPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 460,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: "transparent",
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
    marginBottom: 10,
  },
  playText: { color: "white", fontWeight: "800", fontSize: 18, letterSpacing: 1 },
  muteBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#0ea5aacc" },
  muteText: { color: "white", fontWeight: "700" },
});
