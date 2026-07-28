import { DiscoverView } from "@/components/discover/DiscoverView";

interface DiscoverPageProps {
  searchParams: Promise<{ saved?: string; search?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  return (
    <DiscoverView
      initialShowSavedOnly={params.saved === "true"}
      initialSearchQuery={params.search ?? ""}
    />
  );
}
