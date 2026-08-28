import mongoose, { Schema, Model } from "mongoose";

export interface IProfile {
  _id: string;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileSchema: Schema<IProfile> = new Schema<IProfile>(
  {
    name: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
    collection: "users.profiles",
    _id: false,
  },
);

ProfileSchema.set("_id", false);

export const ProfileModel: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
