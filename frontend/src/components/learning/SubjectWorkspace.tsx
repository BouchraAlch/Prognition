
"use client";

import { useEffect, useState } from "react";

import { TopicsPanel } from "./TopicsPanel";
import { NoteWorkspace } from "./NoteWorkspace";

import type { Topic } from "@/lib/types/database";

interface Props {
  subjectId: string;
  topics: Topic[];
}

export function SubjectWorkspace({ subjectId, topics }: Props) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics[0]?.id ?? null
  );

  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  const selectedTopic =
    topics.find((topic) => topic.id === selectedTopicId) ?? null;

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="min-w-0 md:sticky md:top-24">
        <TopicsPanel
          subjectId={subjectId}
          topics={topics}
          selectedTopicId={selectedTopicId}
          onSelect={setSelectedTopicId}
        />
      </aside>

      <section className="min-w-0">
        <NoteWorkspace
          selectedTopicId={selectedTopicId}
          selectedTopicTitle={selectedTopic?.title ?? null}
        />
      </section>
    </div>
  );
}
