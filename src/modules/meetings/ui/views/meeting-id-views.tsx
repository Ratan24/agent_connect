"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog copy";
import { useState } from "react";


interface Props {
    meetingId: string;
}

export const MeetingIdView = ({meetingId}: Props) => {

    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id: meetingId}));
    const queryClient = useQueryClient();
    const router = useRouter();
    const [RemoveConfirmation, confirmRemove] = useConfirm ("Are you sure", `The following action will remove this meeting`);
    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const removeMeeting = useMutation(trpc.meetings.remove.mutationOptions({
        onSuccess: ()=>{
            queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({pagination: {}}));
            router.push("/meetings");
        },
        onError: (error)=>{
            toast.error(error.message);
        }
    }));

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({id: meetingId});
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog 
            open={updateMeetingDialogOpen}  
            onOpenChange={setUpdateMeetingDialogOpen} 
            initialValues={data} />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader meetingId={meetingId} meetingName={data.name} onEdit={()=>{setUpdateMeetingDialogOpen(true)}} onRemove={handleRemoveMeeting} />
                {JSON.stringify(data,null,2)}
            </div>  
        </>
    )
};

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState title="Loading meeting..." description="Please wait while we load the meeting" />
    )
};


export const MeetingIdViewError = () => {
    return (
        <ErrorState title="Error loading meeting..." description="Please try again later" />
    )
};

