import type { Metadata } from "next";
import CoordinatorTemplate from "@/app/components/coordinator-template";
import { coordinatorProfiles } from "@/app/lib/site-content";

export const metadata: Metadata = {
  title: `${coordinatorProfiles.clev.title}: ${coordinatorProfiles.clev.subtitle}`,
  description: coordinatorProfiles.clev.summary,
  alternates: { canonical: "/coordenadorias/clev" },
  openGraph: { title: `${coordinatorProfiles.clev.title} | DADG IMEPAC`, description: coordinatorProfiles.clev.summary, url: "/coordenadorias/clev" },
};

export default function ClevPage() {
  return <CoordinatorTemplate profile={coordinatorProfiles.clev} />;
}
