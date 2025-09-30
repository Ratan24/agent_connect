"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface Props {
    meetingId: string;
};

export const CallView = ({meetingId}: Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id: meetingId}));

    return (
        <pre className="text-xs whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}