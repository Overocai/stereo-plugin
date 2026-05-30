# Stereo Mic

> [!WARNING]
> **Not working anymore — project discontinued (for now).**
>
> Discord updates its audio modules very frequently, which constantly breaks the patches. Keeping up with every change and figuring out what broke is too much work to do alone, and the **original owner has simply abandoned the project**. So I've decided to step away from it for the time being.
>
> I do intend to fix it eventually — just not right now. It's kept here for reference and as a base for anyone who wants to fork it.

A [Vencord](https://vencord.dev/) / [Equicord](https://equicord.org/) plugin that makes your **microphone transmit in true stereo** (2 channels) instead of Discord's default mono, with a configurable voice bitrate.

It's meant for streamers, musicians and anyone routing audio through virtual cables (e.g. **VoiceMeeter**, VB-Cable) who wants both channels to come through.

## Features

- 🎧 **Stereo voice** — patches Discord's encoder to send 2 channels instead of 1.
- 📈 **Custom voice bitrate** — a slider to push the bitrate up to **512 kbps** (default 512).
- 🛠️ **FEC toggle** — enable/disable Forward Error Correction (off by default; it can cause crackling in stereo).

## Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| **Voice Bitrate** | Slider (8–512 kbps) | `512` | Bitrate used for your outgoing voice. |
| **Enable FEC** | Toggle | `off` | Forward Error Correction. Helps on bad connections but may add crackling in stereo. |

## Installation

This is a **userplugin**, so you need a [development install](https://docs.vencord.dev/installing/) of Vencord or Equicord (the prebuilt installer is not enough).

1. Make sure you have Vencord or Equicord cloned and building from source.
2. Download [`stereoMic.ts`](stereoMic.ts).
3. Create a `userplugins` folder inside `src` if it doesn't exist:
   - **Vencord** → `Vencord/src/userplugins/`
   - **Equicord** → `Equicord/src/userplugins/`
4. Drop `stereoMic.ts` into that folder.
5. Rebuild and reinject:
   ```bash
   pnpm build
   pnpm inject
   ```
6. Restart Discord, then enable **Stereo Mic** in **Settings → Plugins** and adjust the bitrate.

> [!TIP]
> For an actual stereo signal you usually want a stereo source — a stereo microphone or a virtual audio device like **VoiceMeeter** set as your input.

## Notes

- Forcing high bitrate and stereo uses more upload bandwidth.
- Discord changes its audio modules often, so this plugin breaks regularly — that's the main reason it's currently unmaintained.

## Credits

- **Maintained/forked by** [Overocai](https://github.com/Overocai)
- **Original plugin by** Zero' (`1288832011452153910`)

## License

GPL-3.0-or-later, matching the Vencord project.
