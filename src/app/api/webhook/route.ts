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
        console.log("call.session.started event received");
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId as string;

        if (!meetingId) {
            console.error("Missing meetingId in event payload");
            return NextResponse.json(
                {error: "Missing meeting id"},
                {status: 400}
            );
        }
        console.log(`Processing meetingId: ${meetingId}`);

        const [existingMeeting] = await db.select().from(meetings).where(
            and(eq(meetings.id, meetingId), 
            not(eq(meetings.status, "completed")),
            not(eq(meetings.status, "active")),
            not(eq(meetings.status, "cancelled")),
            not(eq(meetings.status, "processing")),
        ));

        if (!existingMeeting) {
            console.error(`Meeting not found for meetingId: ${meetingId}`);
            return NextResponse.json(
                {error: "Meeting not found"},
                {status: 400}
            );
        }
        console.log(`Found existing meeting: ${JSON.stringify(existingMeeting)}`);

        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            console.error(`Agent not found for agentId: ${existingMeeting.agentId}`);
            return NextResponse.json(
                {error: "Agent not found"},
                {status: 400}
            );
        }
        console.log(`Found existing agent: ${JSON.stringify(existingAgent)}`);
    
        
        await db.update(meetings).set({
            status: MeetingStatus.Active,
            startedAt: new Date(),
        }).where(eq(meetings.id, existingMeeting.id));
        

        const call = streamVideo.video.call("default", meetingId);

        try {
            console.log("Connecting OpenAI agent...");
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY!,
                agentUserId: existingAgent.id,
            })

            realtimeClient.updateSession({
                instructions: existingAgent.instructions,
            });
            console.log("OpenAI agent connected and session updated");
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