import { NextResponse } from "next/server";
import { createTopic } from "@/lib/learning/topics";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.subjectId || typeof body.subjectId !== "string") {
      return NextResponse.json({ error: "subjectId is required" }, { status: 400 });
    }
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const topic = await createTopic(body.subjectId, body.title);
    return NextResponse.json(topic, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}