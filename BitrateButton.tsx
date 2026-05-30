/*
 * Stereo Mic — quick bitrate control button for the voice/user panel.
 *
 * Uses Equicord's official UserArea button API so it shows up next to the
 * mute/deafen controls. Clicking it opens a small panel with a slider that
 * changes the voice bitrate live (no need to leave/rejoin the call).
 *
 * The slider is a plain <input type="range"> on purpose: it can't break when
 * Discord shuffles its internal components around.
 */

import { UserAreaButton, UserAreaRenderProps } from "@api/UserArea";
import { ModalContent, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { React, Text } from "@webpack/common";

import { applyBitrate, settings } from "./stereoMic";

export function BitrateIcon({ className }: { className?: string; }) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M11 4a1 1 0 1 1 2 0v16a1 1 0 1 1-2 0V4Zm-4 4a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V8Zm8 0a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V8ZM3 10a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4Zm16 0a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0v-4Z" />
        </svg>
    );
}

function BitrateSlider() {
    const [val, setVal] = React.useState(settings.store.voiceBitrate);

    return (
        <div style={{ padding: "16px 0" }}>
            <Text variant="text-md/semibold" style={{ marginBottom: 12, display: "block" }}>
                {`Voice Bitrate: ${val} kbps`}
            </Text>
            <input
                type="range"
                min={8}
                max={512}
                step={1}
                value={val}
                style={{ width: "100%" }}
                onChange={e => {
                    const v = Number(e.currentTarget.value);
                    setVal(v);
                    settings.store.voiceBitrate = v;
                    applyBitrate();
                }}
            />
        </div>
    );
}

function openBitrateModal() {
    openModal(props => (
        <ModalRoot {...props} size={ModalSize.SMALL}>
            <ModalHeader>
                <Text variant="heading-lg/semibold">Stereo Mic — Bitrate</Text>
            </ModalHeader>
            <ModalContent>
                <BitrateSlider />
            </ModalContent>
        </ModalRoot>
    ));
}

export const renderBitrateButton = (_props: UserAreaRenderProps) => (
    <UserAreaButton
        icon={<BitrateIcon />}
        tooltipText="Voice Bitrate"
        onClick={openBitrateModal}
    />
);
