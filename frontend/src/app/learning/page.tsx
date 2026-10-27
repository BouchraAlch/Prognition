import { SubjectsSection } from "@/components/learning/SubjectsSection";
import { listSubjects } from "@/lib/learning/subjects";

export default async function LearningPage() {
  const subjects = await listSubjects();

  return (
    <main className="min-h-screen bg-white text-[#240765]">
      {/* pt-28 keeps content clear of the fixed navbar */}
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-10">
        <SubjectsSection subjects={subjects} />
      </div>
    </main>
  );
}
