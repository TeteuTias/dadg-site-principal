import type { NextRequest } from "next/server";
import { iniciarLogin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return iniciarLogin(req);
}
