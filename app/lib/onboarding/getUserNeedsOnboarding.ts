import "server-only";

import { connectToDatabase } from "@/app/lib/mongodb";
import { ProfileModel } from "@/app/lib/models/ProfileModel";

export type UserNeedsOnboardingResult = {
  exists: boolean;
  hasName: boolean;
  needsOnboarding: boolean;
};

export async function getUserNeedsOnboarding(userId: string): Promise<UserNeedsOnboardingResult> {
  await connectToDatabase();

  const doc = await ProfileModel.findById(userId).lean<IProfileLike | null>();
  const exists = Boolean(doc);
  const hasName = typeof doc?.name === "string" && doc.name.trim().length > 0;
  const needsOnboarding = !exists || !hasName;

  return { exists, hasName, needsOnboarding };
}

type IProfileLike = {
  name?: string | null;
};
