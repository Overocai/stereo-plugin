import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    voiceBitrate: {
        type: OptionType.SLIDER,
        description: "Voice Bitrate",
        markers: [8, 64, 256, 384, 512],
        default: 512,
        stickToMarkers: false,
        componentProps: {
            // This will skip the save, but oh well, im too lazy to figure out how to properly math floor this b4 saving
            onValueChange: (v: number) => settings.store.voiceBitrate = Math.floor(v),
            onValueRender: (v: number): string => `${v.toFixed(0)}kbps`,
            onMarkerRender: (v: number): string => `${v.toFixed(0)}kbps`
        }
    },
    enableFec: {
        type: OptionType.BOOLEAN,
        description: "Enable forward error correction (FEC)",
        default: false
    }
});

export default definePlugin({
    name: "Stereo Mic",
    description: "Use a stereo microphone, or use Voicemeeter.",
    authors: [{ name: "Overocai", id: 1288832011452153910n }],

    patches: [
        {
            // Stereo + FEC live in the getAttenuationOptions module
            find: "...this.getAttenuationOptions()",
            replacement: [
                {
                    match: /freq:48e3,pacsize:960,channels:1,rate:64e3/,
                    replace: "freq:48e3,pacsize:960,channels:2,params:{stereo:\"1\"},rate:64e3"
                },
                {
                    match: /fec:!0/,
                    replace: "fec:$self.isFecEnabled()"
                }
            ]
        },
        {
            // Override the value inside setVoiceBitRate itself (the real setter,
            // always called on connect; Discord doesn't always go through setBitRate)
            find: "){this.setVoiceBitRate(",
            replacement: {
                match: /setVoiceBitRate\(([A-Za-z_$][\w$]*)\)\{/,
                replace: "setVoiceBitRate($1){$1=$self.getBitrate($1);"
            }
        }
    ],

    settings,

    isFecEnabled() {
        console.log(`[StereoMic] Overriding FEC`)
        return settings.store.enableFec
    },

    getBitrate(orgBitrate: number) {
        console.log(`[StereoMic] Overriding Voice Bitrate (From ${orgBitrate/1000}kbps to ${settings.store.voiceBitrate}kbps)`)

        return settings.store.voiceBitrate*1000
    }
});
