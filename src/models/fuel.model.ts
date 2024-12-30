import mongoose, { Schema, Document } from "mongoose";
import { ProviderSchema, type IProvider } from "./user.model";

export interface IFuel extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  status: boolean;
  provider: IProvider;
}

const FuelSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  status: { type: Boolean, required: true },
  provider: { type: ProviderSchema, required: true },
});

export const Fuel = mongoose.model<IFuel>("Fuel", FuelSchema);
