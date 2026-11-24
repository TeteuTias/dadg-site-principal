import type { NextRequest } from "next/server";
import { sair } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return sair(req);
}
