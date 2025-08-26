// components/QuestionCard.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Sound } from "../lib/sound";


type Props = {
  question: string;
  options: string[];

  // control desde el padre
  selectedIndex: number | null;
  onChangeSelected: (idx: number) => void;

  // modo revisión (muestra colores)
  reveal?: boolean;
  correctIndex?: number | null;

  // botones
  onSubmit?: () => void;       // cuando reveal === false
  onNext?: () => void;         // cuando reveal === true
  submitLabel?: string;        // por defecto "Enviar"
  nextLabel?: string;          // por defecto "Siguiente"
};

export default function QuestionCard({
  question,
  options,
  selectedIndex,
  onChangeSelected = () => {},
  reveal = false,
  correctIndex = null,
  onSubmit,
  onNext,
  submitLabel = "Enviar",
  nextLabel = "Siguiente",
}: Props) {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{question}</Text>
        </View>

        <View style={styles.body}>
          {options.map((opt, idx) => {
            const isSel = selectedIndex === idx;
            const isCorrect = reveal && correctIndex === idx;
            const isWrongSel = reveal && isSel && correctIndex !== idx;

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.9}
                onPress={() => {
                      if (!reveal) {
                        Sound.play("select");      // 👈 blip de selección
                        onChangeSelected(idx);
                      }
                    }}

                disabled={reveal}
                style={[
                  styles.option,
                  isSel && styles.optionSelected,
                  isCorrect && styles.optionCorrect,
                  isWrongSel && styles.optionWrong,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    (isSel || isCorrect) && styles.optionTextBold,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}

          {!reveal ? (
            <TouchableOpacity
              style={[
                styles.submitBtn,
                selectedIndex === null && { opacity: 0.6 },
              ]}
             onPress={() => {
                  Sound.play("tap");           // 👈 tap de botón
                  onSubmit && onSubmit();
                }}

              disabled={selectedIndex === null}
            >
              <Text style={styles.submitText}>{submitLabel}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitBtn} 
                      onPress={() => {
                      Sound.play("tap");           // 👈 tap de botón
                  onNext && onNext();
                    }}

            >
              <Text style={styles.submitText}>{nextLabel}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.privacy}>
            <Text style={styles.dot}>● </Text>No se compartirá tu nombre.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: { paddingHorizontal: 8 },
  card: {
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8d7dc",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
    minHeight: 300,
    marginTop: 100,
  },
  header: { backgroundColor: "#d98ea0", paddingHorizontal: 14, paddingVertical: 12 },
  headerText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  body: { padding: 14, gap: 10 },

  option: {
    backgroundColor: "#efeff0",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: "#dfeef0",
    borderWidth: 2,
    borderColor: "#7fb8be",
  },
  optionCorrect: {
    backgroundColor: "#dcfce7",
    borderWidth: 2,
    borderColor: "#16a34a",
  },
  optionWrong: {
    backgroundColor: "#fee2e2",
    borderWidth: 2,
    borderColor: "#ef4444",
  },

  optionText: { color: "#27272a" },
  optionTextBold: { fontWeight: "800" },

  submitBtn: {
    marginTop: 8,
    backgroundColor: "#c18699",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    elevation: 1,
  },
  submitText: { color: "#fff", fontWeight: "700" },

  privacy: {
    marginTop: 6,
    fontSize: 11,
    color: "#0f172a",
    opacity: 0.75,
    alignSelf: "center",
  },
  dot: { color: "#2ecc71" },
});
