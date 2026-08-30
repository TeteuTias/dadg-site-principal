import mongoose, { Schema, Model, Types } from "mongoose";

export interface IProfile {
  _id: Types.ObjectId;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
    collection: "users.profiles",
    _id: false,
  },
);

export const ProfileModel: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);