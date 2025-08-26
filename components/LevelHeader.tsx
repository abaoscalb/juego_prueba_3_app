// components/LevelHeader.tsx
import { ResizeMode, Video } from "expo-av";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;            // p.ej. "NIVEL 1"
  robotSource: number;      // require("../../assets/robot1.mp4")
};

export default function LevelHeader({ label, robotSource }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{label}</Text>
      </View>

      <View style={styles.robotCircle}>
        <Video
          source={robotSource}
          style={styles.robotVideo}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
          isMuted
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 60,
  },
  pill: {
    backgroundColor: "#178a86",
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pillText: { color: "#fff", fontWeight: "900", letterSpacing: 1, fontSize: 20},
  robotCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f0b6c2",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#f0b6c2",
  },
  robotVideo: {
  width: "180%",   // se expande un poco más que el círculo
  height: "180%",  // asegura que cubra todo
  transform: [{ translateX:0 },{ translateY:-3 }], // lo “corre” un poquito para acercarlo
  }
});
