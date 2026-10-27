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
    <main className="min-h-screen bg-white bg-[linear-gradient(180deg,rgba(167,139,250,0.10)_0%,rgba(255,255,255,0)_320px)] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-7">
          <Link
            href="/learning"
            className="group inline-flex items-center gap-2 rounded-full px-1 text-sm font-semibold
              text-[#21005e]/70 transition-colors hover:text-[#F72585]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]
              focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to Learning
          </Link>

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F72585]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#21005e]/55">
                Learning workspace
              </span>
            </div>

            <h1 className="text-2xl font-extrabold leading-[1.12] tracking-tight text-[#21005e] sm:text-4xl">
              {subject.title}
            </h1>

            {subject.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#21005e]/70 sm:text-base">
                {subject.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-1.5">
            <span className="h-[3px] w-10 rounded-full bg-[#F72585]" />
            <span className="h-[3px] w-6 rounded-full bg-[#FACC15]" />
            <span className="h-[3px] w-4 rounded-full bg-[#4CC9A0]" />
            <span className="h-[3px] w-3 rounded-full bg-[#A78BFA]" />
            <span className="h-px flex-1 bg-[#21005e]/10" />
          </div>
        </header>

        <SubjectWorkspace subjectId={subjectId} topics={topics} />
      </div>
    </main>
  );
}
