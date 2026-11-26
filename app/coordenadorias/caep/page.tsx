import type { Metadata } from "next";
import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export const metadata: Metadata = {
  title: `${coordinatorProfiles.caep.title}: ${coordinatorProfiles.caep.subtitle}`,
  description: coordinatorProfiles.caep.summary,
  alternates: { canonical: "/coordenadorias/caep" },
  openGraph: { title: `${coordinatorProfiles.caep.title} | DADG IMEPAC`, description: coordinatorProfiles.caep.summary, url: "/coordenadorias/caep" },
};

export default function CaepPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.caep} />;
}
