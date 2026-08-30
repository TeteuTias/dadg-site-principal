import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import { getUserNeedsOnboarding } from "@/app/lib/onboarding/getUserNeedsOnboarding";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) return NextResponse.json({ needsOnboarding: true }, { status: 200 });

  const userId = typeof session.user.sub === "string" ? session.user.sub : null;
  if (!userId) return NextResponse.json({ needsOnboarding: true }, { status: 200 });

  const result = await getUserNeedsOnboarding(userId);
  return NextResponse.json({ needsOnboarding: result.needsOnboarding });
}
