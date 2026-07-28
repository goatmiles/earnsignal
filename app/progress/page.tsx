import { ProgressView } from "@/components/progress/ProgressView";

interface ProgressPageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function ProgressPage({ searchParams }: ProgressPageProps) {
  const { slug } = await searchParams;
  return <ProgressView slugParam={slug} />;
}
