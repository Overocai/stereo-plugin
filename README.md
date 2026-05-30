# Stereo Mic — Equicord/Vencord Plugin

A simple Equicord/Vencord plugin that lets you transmit a **stereo microphone** signal (or route audio through **Voicemeeter**) instead of Discord's default mono voice, with extra control over **bitrate** and **forward error correction (FEC)**.

> ⚠️ **Status:** This plugin may break whenever Discord updates its internal voice code. It worked at the time of writing, but is not actively maintained.

---

## Features

- 🎙️ **Stereo microphone transmission** — send true left/right stereo instead of mono.
- 🎚️ **Adjustable voice bitrate** — from 8 kbps up to 512 kbps via a slider.
- 🛡️ **Forward Error Correction (FEC) toggle** — enable/disable Opus FEC for resilience on lossy connections.
- 🔀 **Voicemeeter-friendly** — works well when routing audio through virtual audio cables/Voicemeeter.

> ℹ️ **About the bitrate override:** the bitrate feature *should* be working (roughly an **80% chance** it applies correctly on your setup), but it's **not guaranteed 100%**. Discord may clamp values above ~510 kbps (the Opus codec limit), and the hook depends on internal Discord code that can change between updates. If the bitrate doesn't seem to change, try a value of **510 kbps or lower** and check the console for a `[StereoMic] Overriding Voice Bitrate` log.

## Installation

1. Make sure you have a custom Equicord/Vencord build environment set up ([guide](https://docs.vencord.dev/installing/)).
2. Place this folder inside `src/userplugins/`.
3. Rebuild Equicord/Vencord:
   ```bash
   pnpm build
   ```
4. Restart/reload Discord and enable **Stereo Mic** in the plugin settings.

## Credits

Original work and maintenance by [Overocai](https://github.com/Overocai).

## License

Discontinued / provided as-is. Use at your own risk.
