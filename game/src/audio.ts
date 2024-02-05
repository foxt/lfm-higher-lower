// @ts-ignore
import CorrectAudio from "url:./audio/correct.aac";
// @ts-ignore
import FailAudio from "url:./audio/fail.aac";
// @ts-ignore
import WrongAudio from "url:./audio/wrong.aac";



const AUDIO_FILES = {
    correct: CorrectAudio,
    wrong: WrongAudio,
    fail: FailAudio
}
const AudioCache = new Map<keyof typeof AUDIO_FILES, AudioBuffer>();
const ctx = new AudioContext();


async function loadSound(name: keyof typeof AUDIO_FILES) {
    let f = await fetch(AUDIO_FILES[name]);
    let b = await f.arrayBuffer();
    let d = await ctx.decodeAudioData(b);
    AudioCache.set(name, d);
}
Object.keys(AUDIO_FILES).forEach((k) => loadSound(k as any));

export function playSound(name: keyof typeof AUDIO_FILES, pitch = 0) {
    if (!AudioCache.has(name)) {
        console.error("Audio not loaded", name);
        return;
    }
    let source = ctx.createBufferSource();
    source.buffer = AudioCache.get(name)!;
    
    
    source.connect(ctx.destination);
    source.detune.value = pitch;
    ctx.resume();
    source.start();
}