import type { Metadata } from "next";
import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export const metadata: Metadata = {
  title: `${coordinatorProfiles.cac.title}: ${coordinatorProfiles.cac.subtitle}`,
  description: coordinatorProfiles.cac.summary,
  alternates: { canonical: "/coordenadorias/cac" },
  openGraph: { title: `${coordinatorProfiles.cac.title} | DADG IMEPAC`, description: coordinatorProfiles.cac.summary, url: "/coordenadorias/cac" },
};

export default function CacPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.cac} />;
}
