// lib/sound.ts
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { InteractionManager } from "react-native";

class SoundManager {
  private bg?: Audio.Sound;
  private sfx: Record<string, Audio.Sound | undefined> = {};
  private lastPlay: Record<string, number> = {};

  // estados
  public muted = false;      // música de fondo
  public sfxMuted = false;   // efectos

  // volúmenes base
  private bgVolume = 0.08;
  private sfxVolume = 0.8;

  // mapa único de SFX
  private sfxMap = {
    tap: require("../assets/audio/ui_tap.mp3"),
    select: require("../assets/audio/option_select.mp3"),
    correct: require("../assets/audio/correct.mp3"),
    wrong: require("../assets/audio/wrong.mp3"),
  } as const;

  async init() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });

    // Música de fondo (no aguardamos el play para no bloquear)
    this.bg = new Audio.Sound();
    await this.bg.loadAsync(
      require("../assets/audio/fondo.mp3"),
      { isLooping: true, volume: this.bgVolume },
      true
    );
    if (!this.muted) {
      this.bg.playAsync().catch(() => {});
    }

    // Precargar SFX DESPUÉS de las primeras animaciones/gestos
    InteractionManager.runAfterInteractions(() => {
      this.preloadSfxNonBlocking();
    });
  }

  // Precarga NO bloqueante: cede el hilo entre cada sonido
  private preloadSfxNonBlocking() {
    const names = Object.keys(this.sfxMap) as Array<keyof typeof this.sfxMap>;

    const loadNext = (i: number) => {
      if (i >= names.length) return;

      const name = names[i];
      if (!this.sfx[name]) {
        const snd = new Audio.Sound();
        snd
          .loadAsync(this.sfxMap[name], { volume: this.sfxVolume }, true)
          .then(() => {
            this.sfx[name] = snd;
          })
          .catch(() => {});
      }

      // cede el hilo antes de cargar el próximo
      setTimeout(() => loadNext(i + 1), 0);
    };

    // Arranca en el próximo tick para no competir con el render inicial
    setTimeout(() => loadNext(0), 0);
  }

  // ===== Música =====
  async setMuted(val: boolean) {
    this.muted = val;
    if (!this.bg) return;
    if (val) {
      await this.bg.pauseAsync();
    } else {
      const st = await this.bg.getStatusAsync();
      if (!st.isLoaded) {
        await this.bg.loadAsync(
          require("../assets/audio/fondo.mp3"),
          { isLooping: true, volume: this.bgVolume },
          true
        );
      }
      this.bg.playAsync().catch(() => {});
    }
  }
  toggleMuted() {
    return this.setMuted(!this.muted);
  }

  // ===== Efectos =====
  setSfxMuted(val: boolean) {
    this.sfxMuted = val;
  }
  toggleSfxMuted() {
    this.sfxMuted = !this.sfxMuted;
  }
  setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  // name: 'tap' | 'select' | 'correct' | 'wrong'
  async play(
    name: "tap" | "select" | "correct" | "wrong",
    opts?: { duck?: boolean; volume?: number }
  ) {
    if (this.sfxMuted) return;

    // anti-doble click (throttle)
    const now = Date.now();
    const minGapMs: Record<string, number> = { tap: 160, select: 140, correct: 0, wrong: 0 };
    const gap = minGapMs[name] ?? 0;
    if (gap > 0) {
      const last = this.lastPlay[name] || 0;
      if (now - last < gap) return;
      this.lastPlay[name] = now;
    }

    // cargar si no está (también no bloqueante en la práctica)
    let snd = this.sfx[name];
    if (!snd) {
      snd = new Audio.Sound();
      try {
        await snd.loadAsync(this.sfxMap[name], { volume: this.sfxVolume }, true);
        this.sfx[name] = snd;
      } catch {
        return;
      }
    }

    // Ducking de música si corresponde y la música no está muteada
    if (opts?.duck && this.bg && !this.muted) {
      try {
        await this.bg.setVolumeAsync(0.12);
        setTimeout(() => {
          this.bg && this.bg.setVolumeAsync(this.bgVolume);
        }, 600);
      } catch {}
    }

    // Volumen del sfx (temporal o default)
    try {
      await snd.setStatusAsync({
        volume: typeof opts?.volume === "number" ? opts.volume : this.sfxVolume,
      });
    } catch {}

    await snd.replayAsync();
  }
}

export const Sound = new SoundManager();
