import {and, eq, not} from "drizzle-orm";
import {NextRequest, NextResponse} from "next/server";

import {
    // CallEndedEvent,
    // CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    // CallRecordingReadyEvent,
    CallSessionStartedEvent,

} from "@stream-io/node-sdk";


import {db} from "@/db";
import {agents, meetings} from "@/db/schema";
import {streamVideo} from "@/lib/stream-video";
import { MeetingStatus } from "@/modules/meetings/types";


function verifySignatureWithSDK(body: string, signature: string) {
    return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json(
            {error: "Missing signature or api key"},
            {status: 400}
        );
    }

    const body = await req.text();

    if(!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json(
            {error: "Invalid signature"},
            {status: 401}
        );

    }

    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json(
            {error: "Invalid Json"},
            {status: 400}
        );
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType ==="call.session.started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId as string;

        if (!meetingId) {
            return NextResponse.json(
                {error: "Missing meeting id"},
                {status: 400}
            );
        }
        const [existingMeeting] = await db.select().from(meetings).where(
            and(eq(meetings.id, meetingId), 
            not(eq(meetings.status, "completed")),
            not(eq(meetings.status, "active")),
            not(eq(meetings.status, "cancelled")),
            not(eq(meetings.status, "processing")),
        ));

        if (!existingMeeting) {
            return NextResponse.json(
                {error: "Meeting not found"},
                {status: 400}
            );
        }

        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json(
                {error: "Agent not found"},
                {status: 400}
            );
        }
    
        
        await db.update(meetings).set({
            status: MeetingStatus.Active,
            startedAt: new Date(),
        }).where(eq(meetings.id, existingMeeting.id));
        

        const call = streamVideo.video.call("default", meetingId);

        try {
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id,
            })

            realtimeClient.updateSession({
                instructions: existingAgent.instructions,
            });
        } catch (error) {
            console.error("Error connecting OpenAI agent:", error);
        }
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                {error: "Missing meeting id"},
                {status: 400}
            );
        }
        
        const call = streamVideo.video.call("default", meetingId);
        const { participants } = await call.query();
        if (participants.length === 0) {
            await call.end();
        }
    }
    


    return NextResponse.json({status: "ok"})
}