
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getSubjectById,
  listTopicsBySubject,
} from "@/lib/learning/topics";

import { SubjectWorkspace } from "@/components/learning/SubjectWorkspace";

interface PageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectPage({ params }: PageProps) {
  const { subjectId } = await params;

  const subject = await getSubjectById(subjectId);

  if (!subject) notFound();

  const topics = await listTopicsBySubject(subjectId);

  return (
    <main className="min-h-screen bg-[#F3EBDD] px-4 pb-10 pt-24 text-[#353B2E] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">


        <SubjectWorkspace subjectId={subjectId} topics={topics} />
      </div>
    </main>
  );
}
