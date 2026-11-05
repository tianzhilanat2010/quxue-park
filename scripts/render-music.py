"""Render the original 'Forest Stroll' instrumental (NumPy + FFmpeg).

Run manually when changing the score; not needed for website builds.
No third-party recordings or samples are used.
"""
from pathlib import Path
import subprocess
import tempfile
import wave
import numpy as np

SR = 44100
BEAT = 60 / 78
LENGTH = 64 * BEAT
N = round(SR * LENGTH)
mix = np.zeros((N, 2), dtype=np.float64)
rng = np.random.default_rng(42)


def note(midi, beat, duration, level, pan=0, voice="harp"):
    seconds = duration * BEAT
    t = np.arange(round((seconds + 2) * SR)) / SR
    freq = 440 * 2 ** ((midi - 69) / 12)
    if voice == "pad":
        env = (1 - np.exp(-t / .35)) * np.exp(-t / (seconds * .85))
        wavelet = (np.sin(2 * np.pi * freq * t) + .16 * np.sin(2 * np.pi * freq * 2 * t)) * env
    else:
        wavelet = np.zeros_like(t)
        for harmonic, weight in [(1, 1), (2, .28), (3, .09), (4, .035)]:
            decay = (1.6 if voice == "bell" else 1.15) / harmonic ** .55
            wavelet += weight * np.sin(2 * np.pi * freq * harmonic * t) * np.exp(-t / decay)
        wavelet *= 1 - np.exp(-t / .012)
    # Smooth release, including the rendered tail.
    wavelet *= np.exp(-np.maximum(t - seconds, 0) * 4)
    wavelet *= level
    start = round(beat * BEAT * SR)
    # Wrap tails into the start for a continuous musical loop.
    indices = (start + np.arange(len(t))) % N
    np.add.at(mix[:, 0], indices, wavelet * np.sqrt((1 - pan) / 2))
    np.add.at(mix[:, 1], indices, wavelet * np.sqrt((1 + pan) / 2))


# Cmaj7 – Am7 – Fmaj7 – G, with a contrasting middle phrase.
chords = [[48,55,59,64], [45,52,55,60], [41,48,52,57], [43,50,55,59]]
melodies = [
    [(0,76,1),(1.5,79,.5),(2,81,1),(3,79,.75)],
    [(0,76,1.5),(2,72,1),(3.5,74,.5)],
    [(0,76,1),(1,77,1),(2.5,81,1)],
    [(0,79,1.5),(2,74,1.5)],
    [(0,76,1),(1.5,79,.5),(2,84,1.5)],
    [(0,83,1),(1,81,1),(2.5,79,1)],
    [(0,77,1),(1.5,76,.5),(2,74,1)],
    [(0,74,1.5),(2,71,1.5)],
    [(0,79,1.5),(2,76,1),(3,74,.75)],
    [(0,72,1),(1.5,76,.5),(2.5,79,1)],
    [(0,81,1),(1,79,1),(2.5,77,1)],
    [(0,79,2),(3,74,.75)],
    [(0,76,1),(1.5,79,.5),(2,81,1),(3,79,.75)],
    [(0,76,1.5),(2,72,1.5)],
    [(0,74,1),(1.5,76,.5),(2,77,1)],
    [(0,74,1.5),(2,71,1),(3.5,74,.4)],
]
for bar, phrase in enumerate(melodies):
    chord = chords[bar % 4]
    note(chord[0] - 12, bar * 4, 3.5, .14, -.05)
    for j, pitch in enumerate(chord[1:]):
        note(pitch, bar * 4, 3.8, .022, (j - 1) * .35, "pad")
    for j, idx in enumerate([0, 1, 2, 3, 2, 1]):
        note(chord[idx] + 12, bar * 4 + j * .5 + .025, .65,
             .065 * rng.uniform(.88, 1.08), -.3)
    for offset, pitch, duration in phrase:
        note(pitch, bar * 4 + offset, duration, .17 * rng.uniform(.92, 1.04), .22, "bell")

# Quiet stereo room reflections, circular to preserve the loop tail.
dry = mix.copy()
for delay, gain in [(.13,.13),(.29,.10),(.43,.075),(.61,.05)]:
    mix += np.roll(dry[:, ::-1], round(delay * SR), axis=0) * gain
mix *= .70 / np.max(np.abs(mix))
pcm = (mix * 32767).astype('<i2')
destination = Path(__file__).resolve().parents[1] / 'assets/audio/forest-stroll.mp3'
destination.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as directory:
    wav = Path(directory) / 'music.wav'
    with wave.open(str(wav), 'wb') as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SR)
        output.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame',
                    '-b:a','112k','-metadata','title=Forest Stroll',str(destination)],check=True)
print(f'{destination}: {LENGTH:.2f}s, {destination.stat().st_size} bytes')
