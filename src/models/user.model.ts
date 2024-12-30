import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IProvider extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  username: string;
  password: string;
  name: string;
  status: boolean;
  profile: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  provider: IProvider;
  comparePassword(password: string): Promise<boolean>;
}

export const ProviderSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: Boolean, required: true },
  profile: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  provider: { type: ProviderSchema, required: true },
});

UserSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as IUser;

  if (!user.password) {
    throw new Error("Password is not defined");
  }

  return bcrypt.compare(password, user.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
