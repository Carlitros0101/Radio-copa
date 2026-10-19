// Audio Engine for Especial Deportivo — Liga Por Favor y Gracias
// Powered by server-side Gemini 3.8 Flash TTS with resilient Web Speech fallback

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  activeBlockId: string | null;
  activeTurnId: string | null;
  currentSpeaker: 'Marcelo' | 'Patricio' | null;
  currentTime: number;
  duration: number;
  playbackRate: number;
  engine: 'gemini-tts' | 'browser-tts' | 'idle';
  error: string | null;
}

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private blobCache = new Map<string, string>(); // key -> objectURL
  private listeners: ((state: AudioState) => void)[] = [];

  private state: AudioState = {
    isPlaying: false,
    isLoading: false,
    activeBlockId: null,
    activeTurnId: null,
    currentSpeaker: null,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    engine: 'idle',
    error: null,
  };

  constructor() {
    // Lazy audio context on user gesture
  }

  public initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public subscribe(cb: (state: AudioState) => void) {
    this.listeners.push(cb);
    cb({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    for (const cb of this.listeners) {
      cb({ ...this.state });
    }
  }

  private setState(partial: Partial<AudioState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  public setPlaybackRate(rate: number) {
    this.setState({ playbackRate: rate });
    if (this.currentAudioElement) {
      this.currentAudioElement.playbackRate = rate;
    }
  }

  // Toggle ambient stadium crowd sound using synthetic noise (no external assets required)
  public toggleAmbientSound(enable?: boolean): boolean {
    const ctx = this.initAudioContext();
    const targetState = enable !== undefined ? enable : !this.isAmbientPlaying;

    if (targetState) {
      if (this.ambientGain) return true;
      try {
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        // Lowpass filter for muffled cheering/stadium presence
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        noiseNode.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noiseNode.start();
        this.ambientGain = gain;
        this.isAmbientPlaying = true;
      } catch (e) {
        console.warn('Could not start ambient sound:', e);
      }
    } else {
      if (this.ambientGain) {
        try {
          this.ambientGain.disconnect();
          this.ambientGain = null;
        } catch {
          // ignore
        }
      }
      this.isAmbientPlaying = false;
    }
    return this.isAmbientPlaying;
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  // Stop any active playback
  public stop() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.setState({
      isPlaying: false,
      isLoading: false,
      activeTurnId: null,
      currentSpeaker: null,
      currentTime: 0,
    });
  }

  // Pause playback
  public pause() {
    if (this.currentAudioElement && !this.currentAudioElement.paused) {
      this.currentAudioElement.pause();
      this.setState({ isPlaying: false });
    } else if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.setState({ isPlaying: false });
    }
  }

  // Resume playback
  public resume() {
    if (this.currentAudioElement && this.currentAudioElement.paused) {
      this.currentAudioElement.play().catch(console.error);
      this.setState({ isPlaying: true });
    } else if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.setState({ isPlaying: true });
    }
  }

  // Play a single dialogue turn or quote
  public async playTurn(turn: { id?: string; speaker: 'Marcelo' | 'Patricio'; text: string }, blockId?: string) {
    this.stop();
    this.setState({
      isLoading: true,
      activeBlockId: blockId || null,
      activeTurnId: turn.id || null,
      currentSpeaker: turn.speaker,
      error: null,
    });

    const cacheKey = `single-${turn.speaker}-${turn.text}`;
    let audioUrl = this.blobCache.get(cacheKey);

    if (!audioUrl) {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            speaker: turn.speaker,
            text: turn.text,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `TTS server error: ${response.status}`);
        }

        const data = await response.json();
        if (data.audioBase64) {
          audioUrl = this.createBlobUrlFromBase64(data.audioBase64, data.mimeType || 'audio/wav');
          this.blobCache.set(cacheKey, audioUrl);
        }
      } catch (err: any) {
        console.warn('Gemini TTS failed or unavailable, falling back to Browser TTS:', err);
        this.fallbackBrowserTTS(turn.text, turn.speaker, () => {
          this.setState({
            isPlaying: false,
            activeTurnId: null,
            currentSpeaker: null,
          });
        });
        return;
      }
    }

    if (audioUrl) {
      this.playAudioUrl(audioUrl, 'gemini-tts');
    }
  }

  // Play an entire broadcast block with multi-speaker Gemini 3.8 Flash TTS
  public async playBlock(block: { id: string; turns: { id: string; speaker: 'Marcelo' | 'Patricio'; text: string }[] }) {
    this.stop();
    this.setState({
      isLoading: true,
      activeBlockId: block.id,
      activeTurnId: block.turns[0]?.id || null,
      currentSpeaker: block.turns[0]?.speaker || 'Marcelo',
      error: null,
    });

    const cacheKey = `block-${block.id}`;
    let audioUrl = this.blobCache.get(cacheKey);

    if (!audioUrl) {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            turns: block.turns,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `TTS server error: ${response.status}`);
        }

        const data = await response.json();
        if (data.audioBase64) {
          audioUrl = this.createBlobUrlFromBase64(data.audioBase64, data.mimeType || 'audio/wav');
          this.blobCache.set(cacheKey, audioUrl);
        }
      } catch (err: any) {
        console.warn('Gemini TTS block generation error, cascading line-by-line fallback:', err);
        // Fallback to sequential browser synthesis for this block
        this.playBlockFallback(block.turns, block.id);
        return;
      }
    }

    if (audioUrl) {
      this.playAudioUrl(audioUrl, 'gemini-tts', block.turns);
    }
  }

  private playAudioUrl(
    url: string,
    engine: 'gemini-tts' | 'browser-tts',
    turns?: { id: string; speaker: 'Marcelo' | 'Patricio'; text: string }[]
  ) {
    const audio = new Audio(url);
    audio.playbackRate = this.state.playbackRate;
    this.currentAudioElement = audio;

    // Attach to Web Audio analyser if available
    try {
      const ctx = this.initAudioContext();
      if (!this.audioSourceNode && this.analyser) {
        this.audioSourceNode = ctx.createMediaElementSource(audio);
        this.audioSourceNode.connect(this.analyser);
        this.analyser.connect(ctx.destination);
      }
    } catch {
      // Element might already be hooked or CORS prevented
    }

    audio.onloadedmetadata = () => {
      this.setState({
        duration: audio.duration,
        isLoading: false,
        isPlaying: true,
        engine,
      });
    };

    audio.ontimeupdate = () => {
      this.setState({
        currentTime: audio.currentTime,
        duration: audio.duration || this.state.duration,
      });

      // Synchronize active turn speaker based on approximate proportion of speech
      if (turns && turns.length > 0 && audio.duration > 0) {
        const progress = audio.currentTime / audio.duration;
        const totalChars = turns.reduce((acc, t) => acc + t.text.length, 0);
        let accumulated = 0;
        let matchedIndex = 0;
        for (let i = 0; i < turns.length; i++) {
          accumulated += turns[i].text.length;
          if (progress <= accumulated / totalChars) {
            matchedIndex = i;
            break;
          }
        }
        const activeTurn = turns[matchedIndex];
        if (activeTurn && activeTurn.id !== this.state.activeTurnId) {
          this.setState({
            activeTurnId: activeTurn.id,
            currentSpeaker: activeTurn.speaker,
          });
        }
      }
    };

    audio.onended = () => {
      this.setState({
        isPlaying: false,
        isLoading: false,
        activeTurnId: null,
        currentSpeaker: null,
      });
    };

    audio.onerror = () => {
      this.setState({
        isPlaying: false,
        isLoading: false,
        error: 'Error reproduciendo el audio sintético',
      });
    };

    audio.play().catch((err) => {
      console.warn('Playback error:', err);
      this.setState({ isLoading: false, isPlaying: false });
    });
  }

  // Fallback sequential speech synthesis
  private playBlockFallback(
    turns: { id: string; speaker: 'Marcelo' | 'Patricio'; text: string }[],
    blockId: string
  ) {
    let index = 0;
    const playNext = () => {
      if (index >= turns.length) {
        this.setState({
          isPlaying: false,
          isLoading: false,
          activeTurnId: null,
          currentSpeaker: null,
        });
        return;
      }
      const turn = turns[index];
      this.setState({
        isPlaying: true,
        isLoading: false,
        activeBlockId: blockId,
        activeTurnId: turn.id,
        currentSpeaker: turn.speaker,
        engine: 'browser-tts',
      });
      index++;
      this.fallbackBrowserTTS(turn.text, turn.speaker, playNext);
    };
    playNext();
  }

  // Fallback to browser SpeechSynthesis
  private fallbackBrowserTTS(text: string, speaker: 'Marcelo' | 'Patricio', onEnd: () => void) {
    if (!('speechSynthesis' in window)) {
      this.setState({
        isLoading: false,
        isPlaying: false,
        error: 'El navegador no soporta síntesis de voz',
      });
      onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CL';

    // Try finding a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const esVoice =
      voices.find((v) => v.lang.includes('es-CL')) ||
      voices.find((v) => v.lang.includes('es-419')) ||
      voices.find((v) => v.lang.startsWith('es')) ||
      voices[0];

    if (esVoice) utterance.voice = esVoice;

    if (speaker === 'Marcelo') {
      utterance.pitch = 1.15;
      utterance.rate = 1.05 * this.state.playbackRate;
    } else {
      utterance.pitch = 0.82;
      utterance.rate = 0.95 * this.state.playbackRate;
    }

    utterance.onend = () => {
      onEnd();
    };

    utterance.onerror = () => {
      onEnd();
    };

    this.setState({
      isLoading: false,
      isPlaying: true,
      engine: 'browser-tts',
    });

    window.speechSynthesis.speak(utterance);
  }

  private createBlobUrlFromBase64(base64: string, mimeType: string): string {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  }
}

export const audioEngine = new AudioEngine();
