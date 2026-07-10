import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

import ErrorBoundary from "@components/ErrorBoundary";
import { renderBitrateButton } from "./BitrateButton";

// Last voice connection seen by the setVoiceBitRate hook, so we can re-apply
// the bitrate live (while in a call) when the slider changes.
let currentConn: any = null;

export function applyBitrate() {
    if (!currentConn) return;
    try {
        // Clear the cached value so the guard inside setVoiceBitRate
        // (if this.voiceBitrate === e return) never short-circuits our change.
        currentConn.voiceBitrate = undefined;
        currentConn.setVoiceBitRate(settings.store.voiceBitrate * 1000);
    } catch (e) {
        console.error("[StereoMic] Failed to apply bitrate live:", e);
    }
}

export const settings = definePluginSettings({
    voiceBitrate: {
        type: OptionType.SLIDER,
        description: "Voice Bitrate",
        markers: [8, 64, 256, 384, 512],
        default: 512,
        stickToMarkers: false,
        componentProps: {
            // This will skip the save, but oh well, im too lazy to figure out how to properly math floor this b4 saving
            onValueChange: (v: number) => {
                settings.store.voiceBitrate = Math.floor(v);
                applyBitrate(); // re-apply live so it changes without rejoining the call
            },
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

    settings,

    patches: [
        {
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
            find: "){this.setVoiceBitRate(",
            replacement: {
                match: /setVoiceBitRate\(([A-Za-z_$][\w$]*)\)\{/,
                replace: "setVoiceBitRate($1){$1=$self.getBitrate(this,$1);"
            }
        },
        {
            find: "#{intl::USER_PROFILE_ACCOUNT_POPOUT_BUTTON_A11Y_LABEL}",
            replacement: {
                match: /children:\[(?=.{0,25}?accountContainerRef)/,
                replace: "children:[$self.renderBitrateButton(arguments[0]),"
            }
        }
    ],

    renderBitrateButton: ErrorBoundary.wrap(renderBitrateButton, { noop: true }),

    isFecEnabled() {
        console.log(`[StereoMic] Overriding FEC`)
        return settings.store.enableFec
    },

    getBitrate(conn: any, orgBitrate: number) {
        currentConn = conn; // remember the live connection so the slider can re-apply

        console.log(`[StereoMic] Overriding Voice Bitrate (From ${orgBitrate/1000}kbps to ${settings.store.voiceBitrate}kbps)`)

        return settings.store.voiceBitrate*1000
    }
});
