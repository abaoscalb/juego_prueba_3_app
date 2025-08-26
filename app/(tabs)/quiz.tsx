// app/(tabs)/quiz.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import LevelHeader from "../../components/LevelHeader";
import QuestionCard from "../../components/QuestionCard";
import { Sound } from "../../lib/sound";

const DATA_URL =
  "https://gist.githubusercontent.com/Oscar-skr/407c4db8d978c1817abfaf9f3f37b709/raw/quiz.json";

type Level = { id?: string; title?: string; questions?: any[] };
type QuestionLike = {
  questionText?: string;
  question?: string;
  text?: string;
  options?: string[];
  answers?: string[];
  choices?: string[];
  // distintas variantes que puede traer tu JSON
  correctAnswerIndex?: number;
  correctIndex?: number;
  correct?: string;
  correctAnswer?: string;
  answer?: string;
};

export default function QuizScreen() {
  const { levelId } = useLocalSearchParams<{ levelId?: string }>();
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);

  // estado de juego
  const [qIndex, setQIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // === cargar nivel ===
  const fetchLevel = useCallback(async () => {
    try {
      setLoading(true);
      const r = await fetch(DATA_URL, { cache: "no-store" });
      const json = await r.json();
      const arr: Level[] = Array.isArray(json?.levels) ? json.levels : [];

      let found: Level | null = null;
      if (levelId) {
        found =
          arr.find((l) => String(l.id) === String(levelId)) ??
          (() => {
            const n = Number(String(levelId).replace(/[^\d]/g, ""));
            return Number.isFinite(n) ? arr[n - 1] : null;
          })() ??
          null;
      } else {
        found = arr[0] ?? null;
      }
      setLevel(found);
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel]);

  // lista de preguntas y pregunta actual
  const questions: QuestionLike[] = useMemo(
    () => (Array.isArray(level?.questions) ? (level!.questions as QuestionLike[]) : []),
    [level]
  );

  const currentQ = questions[qIndex];

  // textos/opciones compat múltiples formatos
  const qText =
    currentQ?.questionText || currentQ?.question || currentQ?.text || "Pregunta";

  const opts: string[] =
    currentQ?.options || currentQ?.answers || currentQ?.choices || [];

  // índice correcto (acepta índice numérico o texto que matchee opción)
  const correctIndex = useMemo(() => {
    if (!currentQ) return -1;
    if (Number.isFinite(currentQ.correctAnswerIndex))
      return Number(currentQ.correctAnswerIndex);
    if (Number.isFinite(currentQ.correctIndex))
      return Number(currentQ.correctIndex);

    const ans = currentQ.correct ?? currentQ.correctAnswer ?? currentQ.answer;
    if (typeof ans === "string" && opts?.length) {
      const idx = opts.findIndex(
        (o) => o?.trim().toLowerCase() === ans.trim().toLowerCase()
      );
      return idx >= 0 ? idx : -1;
    }
    return -1;
  }, [currentQ, opts]);

  // acciones
        const handleSubmit = () => {
          if (selectedIndex === null) return;

        const isCorrect = selectedIndex === correctIndex;

        // 🔊 sonido + ducking de la música de fondo
         Sound.play(isCorrect ? "correct" : "wrong", { duck: true });

          if (isCorrect) setScore((s) => s + 1);
          setReveal(true);
    };


  const goNext = () => {
    const last = qIndex >= questions.length - 1;
    if (last) {
      setFinished(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelectedIndex(null);
    setReveal(false);
  };

  const retryLevel = () => {
    setQIndex(0);
    setSelectedIndex(null);
    setReveal(false);
    setScore(0);
    setFinished(false);
  };

  // === renders ===
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!level || !questions.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text>No encontré preguntas para este nivel.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.content, { alignItems: "center" }]}>
          <LevelHeader
            label={level.title ? level.title.toUpperCase() : "NIVEL"}
            robotSource={require("../../assets/robot1.mp4")}
          />
          <Text style={styles.resultTitle}>¡Nivel completado!</Text>
          <Text style={styles.resultScore}>
            Puntaje: {score} / {questions.length}
          </Text>

          <View style={{ height: 12 }} />

          <TouchableOpacity style={styles.btnPrimary} onPress={retryLevel}>
            <Text style={styles.btnPrimaryText}>Volver a intentar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnLink}
            onPress={() => router.replace("/levels")}
          >
            <Text style={styles.btnLinkText}>Volver a los niveles</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <LevelHeader
          label={level.title ? level.title.toUpperCase() : "NIVEL"}
          robotSource={require("../../assets/robot1.mp4")}
        />

        {/* Progreso */}
        <Text style={styles.progress}>
          Pregunta {qIndex + 1} de {questions.length}
        </Text>

        <QuestionCard
          question={qText}
          options={opts}
          selectedIndex={selectedIndex}
          onChangeSelected={setSelectedIndex}
          reveal={reveal}
          correctIndex={correctIndex}
          onSubmit={handleSubmit}
          onNext={goNext}
          submitLabel="Enviar"
          nextLabel={qIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1c7cf" },
  content: { padding: 16, paddingBottom: 28 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  progress: {
    alignSelf: "center",
    marginBottom: 8,
    color: "#334155",
    fontWeight: "700",

  },

  resultTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 8,
  },
  resultScore: {
    fontSize: 16,
    color: "#0f172a",
    marginTop: 6,
  },

  btnPrimary: {
    marginTop: 16,
    backgroundColor: "#178a86",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },

  btnLink: { marginTop: 10, padding: 8 },
  btnLinkText: { color: "#1d4ed8", fontWeight: "700" },
});
