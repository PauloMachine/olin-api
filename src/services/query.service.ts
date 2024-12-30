import { Request } from "express";

export class QueryService {
  static async findProvider(model: any, req: Request, query: any = {}) {
    const provider = (req as any).user?.provider;

    if (!provider) {
      throw new Error("Provider is required for this query");
    }

    return model.find({ ...query, "provider._id": provider._id });
  }

  static async findOneProvider(model: any, req: Request, query: any = {}) {
    const provider = (req as any).user?.provider;

    if (!provider) {
      throw new Error("Provider is required for this query");
    }

    return model.findOne({ ...query, "provider._id": provider._id });
  }

  static async createProvider(model: any, req: Request, data: any) {
    const provider = (req as any).user?.provider;

    if (!provider) {
      throw new Error("Provider is required for this operation");
    }

    data.provider = provider;
    return await model.create(data);
  }
}
