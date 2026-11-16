


import { NextResponse } from "next/server";
import { createTopic, deleteTopic } from "@/lib/learning/topics";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.subjectId || typeof body.subjectId !== "string") {
      return NextResponse.json(
        { error: "subjectId is required" },
        { status: 400 }
      );
    }

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const topic = await createTopic(body.subjectId, body.title);

    return NextResponse.json(topic, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    const status = message === "Not authenticated" ? 401 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const topicId = searchParams.get("id");
    const subjectId = searchParams.get("subjectId");

    if (!topicId || !subjectId) {
      return NextResponse.json(
        { error: "Topic ID and subject ID are required" },
        { status: 400 }
      );
    }

    await deleteTopic(topicId, subjectId);

    return NextResponse.json(
      { message: "Topic deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    const status =
      message === "Not authenticated" ? 401 :
      message.includes("not found") ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { topicId, subjectId, title } = body;

    if (
      typeof topicId !== "string" ||
      typeof subjectId !== "string" ||
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid topic information" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("topics")
      .update({ title: title.trim() })
      .eq("id", topicId)
      .eq("subject_id", subjectId)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "Topic not found or permission denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
