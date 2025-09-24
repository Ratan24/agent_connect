import {
    // CallEndedEvent,
    // CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    // CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import {and, eq, not} from "drizzle-orm";

import {NextRequest, NextResponse} from "next/server";
import {headers} from "next/headers";

import {db} from "@/db";

import {agents, meetings} from "@/db/schema";

import {streamVideo} from "@/lib/stream-video";

function verifySignatureWithSDK(body: string, signature: string):boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    console.log("🚀 WEBHOOK RECEIVED!");
    const headersList = await headers();
    const signature = headersList.get("x-signature");
    const apiKey = headersList.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json({error: "Signature and API key are required"}, {status: 400});
    }

    const body = await req.text();
    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({error: "Invalid signature"}, {status: 401});
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch (error) {
        return NextResponse.json({error: "Invalid payload"}, {status: 400});
    }

    const eventType = (payload as Record<string, unknown>)?.type;
    console.log("📌 Event Type:", eventType);  // ADD THIS

    if(eventType==="call.session_started") {
        console.log("✅ Processing call.session.started");  // ADD THIS
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;
        
        console.log("📝 Meeting ID from event:", meetingId);  // ADD THIS

        if(!meetingId) {
            console.log("❌ No meetingId found in custom data");  // ADD THIS
            return NextResponse.json({error: "Missing MeetingID"}, {status: 400});
        }

        console.log("🔍 Looking for meeting with ID:", meetingId);  // ADD THIS
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    eq(meetings.status, "upcoming"),
                )
            );
        
        console.log("📊 Found meeting:", existingMeeting);  // ADD THIS
            
        if(!existingMeeting) {
            console.log("❌ Meeting not found in database");  // ADD THIS
            return NextResponse.json({error: "Meeting not found"}, {status: 404});
        }

        console.log("🔄 Updating meeting status to active");  // ADD THIS
        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, meetingId));

        console.log("✅ Meeting status updated, connecting AI agent");  // ADD THIS
        
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            console.log("❌ Agent not found");  // ADD THIS
            return NextResponse.json({error: "Agent not found"}, {status: 404});
        }

        console.log("🤖 Connecting OpenAI agent:", existingAgent.name);  // ADD THIS
        const call = streamVideo.video.call("default", meetingId);
        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id,
        });

        realtimeClient.updateSession({
            instructions: existingAgent.instructions,
        });
        
        console.log("✅ Agent connected successfully!");  // ADD THIS
    } else if (eventType == "call.session_participant_left") {
        // ... rest of your code
    }

    return NextResponse.json({status: "ok"});
}