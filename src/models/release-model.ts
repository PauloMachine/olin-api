import mongoose, { Schema, Document } from "mongoose";
import { ProviderSchema, type IProvider } from "./user.model";

export interface IFuelType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  status: boolean;
}

export interface IFuel extends Document {
  inlet: string;
  outlet: string;
  type: IFuelType;
  cost: string;
  price: string;
  invoice: string;
}

export interface IGasStation extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  status: boolean;
}

export interface IType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface IRelease extends Document {
  name: string;
  type: IType;
  fuel: IFuel;
  gasStation: IGasStation;
  totalProfit: string;
  totalFuel: string;
  differenceFuel: string;
  createdAt: Date;
  provider: IProvider;
}

interface IReleaseOptions {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
}

const FuelTypeSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  status: { type: Boolean, required: true },
});

const FuelSchema: Schema = new Schema({
  inlet: { type: String },
  outlet: { type: String },
  type: { type: FuelTypeSchema, required: true },
  cost: { type: String },
  price: { type: String },
});

const GasStationSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  status: { type: Boolean, required: true },
});

const TypeSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const ReleaseSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: TypeSchema, required: true },
  fuel: { type: FuelSchema, required: true },
  gasStation: { type: GasStationSchema, required: true },
  totalProfit: { type: String },
  totalFuel: { type: String },
  differenceFuel: { type: String },
  createdAt: { type: Date, default: Date.now },
  provider: { type: ProviderSchema, required: true },
});

const ReleaseOptionsSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Release = mongoose.model<IRelease>("Release", ReleaseSchema);
export const ReleaseOptions = mongoose.model<IReleaseOptions>(
  "ReleaseOptions",
  ReleaseOptionsSchema
);
