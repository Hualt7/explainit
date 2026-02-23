/**
 * Background music tracks by mood for explainer videos.
 * All URLs are royalty-free (Pixabay CDN) and suitable for looping.
 * Replace with your own CDN URLs per mood if desired.
 */
import type { MusicMood } from "../store/useSettingsStore";

const CALM_URL = "https://cdn.pixabay.com/audio/2024/11/28/audio_7a0827a05a.mp3";

export const BACKGROUND_MUSIC: Record<Exclude<MusicMood, "none">, string> = {
    calm: CALM_URL,
    uplifting: CALM_URL,
    corporate: CALM_URL,
    playful: CALM_URL,
};

export function getMusicUrl(mood: MusicMood): string | null {
    if (mood === "none") return null;
    return BACKGROUND_MUSIC[mood] ?? BACKGROUND_MUSIC.calm;
}
