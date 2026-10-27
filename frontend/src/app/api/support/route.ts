import { NextResponse } from "next/server";
import {
  SUPPORT_TOPICS,
  createSupportMessage,
  type SupportTopic,
} from "@/lib/support/messages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const topic = String(body.topic ?? "");
  const message = String(body.message ?? "").trim();

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }
  if (!SUPPORT_TOPICS.includes(topic as SupportTopic)) {
    return NextResponse.json({ error: "Choose a topic." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { error: "Your message must be between 10 and 2000 characters." },
      { status: 400 }
    );
  }

  try {
    await createSupportMessage({
      name,
      email,
      topic: topic as SupportTopic,
      message,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
