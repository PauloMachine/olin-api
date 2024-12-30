import { GasStation } from "../models/gas-station.model";
import { QueryService } from "./query.service";
import { Request } from "express";

export class GasStationService {
  static async create(req: Request, data: any) {
    data.status = true;
    return await QueryService.createProvider(GasStation, req, data);
  }

  static async find(req: Request, status: any) {
    const query: any = {};
    if (status) query["status"] = true;

    return await QueryService.findProvider(GasStation, req, query);
  }

  static async findByIdAndUpdate(data: any) {
    const { _id, status } = data;
    return await GasStation.findByIdAndUpdate(_id, { status }, { new: true });
  }
}
