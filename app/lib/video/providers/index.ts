import type { VideoProvider, ProviderKey } from "../types";
import { veoProvider } from "./veo";
import { runwayProvider } from "./runway";
import { klingProvider } from "./kling";

const providers: Record<ProviderKey, VideoProvider> = {
    veo: veoProvider,
    runway: runwayProvider,
    kling: klingProvider,
};

export function getProvider(key: ProviderKey): VideoProvider {
    const provider = providers[key];
    if (!provider) {
        throw new Error(`Unknown video provider: ${key}`);
    }
    return provider;
}

export { veoProvider, runwayProvider, klingProvider };
