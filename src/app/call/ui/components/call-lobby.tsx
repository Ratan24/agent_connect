import {LogInIcon} from "lucide-react";
import Link from "next/link";
import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview,
} from "@stream-io/video-react-sdk";

import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";

import {generateAvatarUri} from "@/lib/avatar";
import "@stream-io/video-react-sdk/dist/css/styles.css";


interface Props {
    onJoin: () => void;
};

const DisabledVideoPreview = () => {
    const {data} = authClient.useSession();
    return (
        <DefaultVideoPlaceholder 
        participant={{
            name: data?.user.name || "",
            image: data?.user.image || generateAvatarUri({seed: data?.user.id || "", variant: "initials"}),
        }as StreamVideoParticipant} 
        />
    )
}

const AllowedBrowserPermissions = () => {
    return (
        <p className="text-sm">
            Please grant the browser permissions to access your camera and microphone.
        </p>
    )
}


export const CallLobby = ({onJoin}: Props) => {
    const {useCameraState, useMicrophoneState} = useCallStateHooks();
    const {hasBrowserPermission: hasMicPermission} = useMicrophoneState();
    const {hasBrowserPermission: hasCamPermission} = useCameraState();
    const hasBrowserPermission = hasMicPermission && hasCamPermission;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className=" py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className= "flex flex-col text-center gap-y-2">
                        <h6 className="text-lg font-medium">Ready to join the call?</h6>
                        <p className="text-sm"> Set up your audio and video to join the call.</p>

                    </div>
                    <VideoPreview 
                    DisabledVideoPreview = {
                        hasBrowserPermission 
                        ? DisabledVideoPreview 
                        : AllowedBrowserPermissions
                    }
                    />
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost"> 
                            <Link href="/meetings">
                                Cancel
                            </Link>
                        </Button>
                        <Button onClick={onJoin}> 
                            <LogInIcon />
                            Join Call</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

