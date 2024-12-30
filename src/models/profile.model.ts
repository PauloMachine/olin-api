import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
}

const ProfileSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
