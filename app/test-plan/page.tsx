import { TestPlanView } from "@/components/test-plan/TestPlanView";

interface TestPlanPageProps {
  searchParams: Promise<{ slug?: string; day?: string }>;
}

export default async function TestPlanPage({ searchParams }: TestPlanPageProps) {
  const { slug, day } = await searchParams;
  const dayParam = day ? Number.parseInt(day, 10) : undefined;
  return (
    <TestPlanView
      slugParam={slug}
      dayParam={Number.isFinite(dayParam) ? dayParam : undefined}
    />
  );
}
