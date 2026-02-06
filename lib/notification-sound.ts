let cachedBlobUrl: string | null = null;

/**
 * Generates a two-tone notification chime as a WAV blob URL.
 * Uses HTMLAudioElement instead of AudioContext so it works
 * even when the browser tab is in the background.
 */
function getNotificationBlobUrl(): string {
    if (cachedBlobUrl) return cachedBlobUrl;

    const sampleRate = 22050;
    const volume = 0.35;

    // Two-tone chime: C5 (523 Hz) then E5 (659 Hz)
    const tones = [
        { freq: 523.25, start: 0, duration: 0.35 },
        { freq: 659.25, start: 0.15, duration: 0.35 },
    ];

    const totalDuration = 0.55; // seconds
    const numSamples = Math.ceil(sampleRate * totalDuration);
    const samples = new Float32Array(numSamples);

    for (const tone of tones) {
        const startSample = Math.floor(tone.start * sampleRate);
        const toneSamples = Math.floor(tone.duration * sampleRate);

        for (let i = 0; i < toneSamples; i++) {
            const sampleIndex = startSample + i;
            if (sampleIndex >= numSamples) break;

            const t = i / sampleRate;
            // Sine wave
            const wave = Math.sin(2 * Math.PI * tone.freq * t);
            // Envelope: quick attack, smooth decay
            const attack = Math.min(t / 0.02, 1);
            const decay = Math.exp(-t * 6);
            const envelope = attack * decay;

            samples[sampleIndex] += wave * envelope * volume;
        }
    }

    // Encode as 16-bit PCM WAV
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = numSamples * numChannels * (bitsPerSample / 8);
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++)
            view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // chunk size
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    // Write samples
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
        const clamped = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, clamped * 0x7fff, true);
        offset += 2;
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    cachedBlobUrl = URL.createObjectURL(blob);
    return cachedBlobUrl;
}

/**
 * Plays a notification chime using HTMLAudioElement.
 * Works even when the browser tab is in the background
 * (unlike AudioContext which gets suspended).
 */
export function playNotificationSound() {
    try {
        const url = getNotificationBlobUrl();
        const audio = new Audio(url);
        audio.play().catch(() => {
            // Autoplay blocked — fail silently
        });
    } catch {
        // Audio not supported — fail silently
    }
}
