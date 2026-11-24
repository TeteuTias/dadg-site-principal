import type { NextRequest } from "next/server";
import { concluirLogin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return concluirLogin(req);
}
