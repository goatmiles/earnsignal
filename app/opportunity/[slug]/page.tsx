import { notFound } from "next/navigation";

import { getOpportunityBySlug } from "@/lib/data/opportunities";
import { OpportunityDetailView } from "@/components/opportunity/OpportunityDetailView";

interface OpportunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  return <OpportunityDetailView opportunity={opportunity} />;
}
