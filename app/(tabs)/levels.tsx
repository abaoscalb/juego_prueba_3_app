import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar as RNStatusBar,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Sound } from "../../lib/sound";

const DATA_URL =
  "https://gist.githubusercontent.com/Oscar-skr/407c4db8d978c1817abfaf9f3f37b709/raw/quiz.json";

type Level = {
  id?: string;
  title?: string;
  questions?: any[];
  [k: string]: any;
};

export default function LevelsScreen() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const r = await fetch(DATA_URL, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const json = await r.json();

      // tu JSON viene como { media: {...}, levels: [...] }
      const arr: Level[] = Array.isArray(json?.levels) ? json.levels : [];
      setLevels(arr);
    } catch (e) {
      setError("No pude cargar los niveles. Desliza para reintentar.");
      setLevels([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando niveles…</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!levels.length) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hay niveles disponibles.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={levels}
        keyExtractor={(it, i) => String(it.id ?? i)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => {
          const count = Array.isArray(item.questions)
            ? item.questions.length
            : undefined;
          return (
            <View style={styles.levelWrapper}>
              <View style={styles.levelShadow} />
<TouchableOpacity
  style={styles.levelBtn}
  activeOpacity={0.9}
  onPress={() => {
    Sound.play("tap"); // 👈 fire-and-forget, SIN await
    router.push({
      pathname: "/quiz",
      params: { levelId: item.id ?? `lvl${index + 1}` },
    });
  }}
>
  <Text style={styles.levelText}>
    {item.title || `NIVEL ${index + 1}`}
  </Text>
  {!!count && <Text style={styles.levelSub}>{count} preguntas</Text>}
</TouchableOpacity>


            </View>
          );
        }}
      />
    );
  }, [loading, error, levels, refreshing, onRefresh, fetchData]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden={false} style="dark" translucent />
      <View style={styles.container}>
        {/* robot video arriba a la derecha */}
        <Video
          source={require("../../assets/images/robot.mp4")}
          style={styles.robot}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
          isMuted
        />
        <Text style={styles.title}>Elegí un nivel</Text>
        {content}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 8,
    marginBottom: 14,
  },
robot: {
  width: 110,
  height: 110,
  alignSelf: "flex-end", // si lo querés arriba a la derecha
  marginTop: 4,
},
  listContent: { paddingBottom: 28, paddingTop: 12, gap: 18 },
  levelWrapper: { position: "relative" },
  levelShadow: {
    position: "absolute",
    left: 10,
    right: -6,
    bottom: -6,
    top: 10,
    borderRadius: 999,
    backgroundColor: "#d7f0f4",
  },
  levelBtn: {
    backgroundColor: "#117e85",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  levelText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  levelSub: { color: "#e0f2f1", fontSize: 12, marginTop: 4, opacity: 0.9 },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12 },
  loadingText: { color: "#334155" },
  errorText: { color: "#b91c1c", fontWeight: "700" },
  retryBtn: { backgroundColor: "#117e85", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "white", fontWeight: "700" },
  emptyText: { color: "#334155" },
});
