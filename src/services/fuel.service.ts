import { Fuel } from "../models/fuel.model";
import { QueryService } from "./query.service";
import { Request } from "express";

export class FuelService {
  static async create(req: Request, data: any) {
    data.status = true;
    return await QueryService.createProvider(Fuel, req, data);
  }

  static async find(req: Request, status?: any) {
    const query: any = {};
    if (status) query["status"] = true;

    return await QueryService.findProvider(Fuel, req, query);
  }

  static async findByIdAndUpdate(data: any) {
    const { _id, status } = data;
    return await Fuel.findByIdAndUpdate(_id, { status }, { new: true });
  }
}
