import type { Metadata } from "next";
import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export const metadata: Metadata = {
  title: `${coordinatorProfiles.caes.title}: ${coordinatorProfiles.caes.subtitle}`,
  description: coordinatorProfiles.caes.summary,
  alternates: { canonical: "/coordenadorias/caes" },
  openGraph: { title: `${coordinatorProfiles.caes.title} | DADG IMEPAC`, description: coordinatorProfiles.caes.summary, url: "/coordenadorias/caes" },
};

export default function CaesPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.caes} />;
}
