import mongoose, { Schema, Document } from "mongoose";
import { ProviderSchema, type IProvider } from "./user.model";

export interface IGasStation extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  status: boolean;
  provider: IProvider;
}

const GasStationSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  status: { type: Boolean, required: true },
  provider: { type: ProviderSchema, required: true },
});

export const GasStation = mongoose.model<IGasStation>(
  "GasStation",
  GasStationSchema
);
