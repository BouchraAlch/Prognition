import { NextResponse } from "next/server";
import { getOrCreateNote, updateNote } from "@/lib/learning/notes";

// POST { topicId } → get or create note for that topic
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.topicId || typeof body.topicId !== "string") {
      return NextResponse.json({ error: "topicId is required" }, { status: 400 });
    }
    const note = await getOrCreateNote(body.topicId);
    return NextResponse.json(note);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT { id, content } → update note content
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    if (typeof body.content !== "string") {
      return NextResponse.json({ error: "content must be a string" }, { status: 400 });
    }
    const note = await updateNote(body.id, body.content);
    return NextResponse.json(note);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}