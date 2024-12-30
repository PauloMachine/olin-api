import { Request } from "express";

export class QueryService {
  static async findProvider(
    model: any,
    req: Request,
    query: any = {},
    sort?: any,
    lean: boolean = false,
    limit?: number
  ) {
    const provider = (req as any).user?.provider;

    if (!provider) {
      throw new Error("Provider is required for this query");
    }

    let queryBuilder = model.find({
      ...query,
      "provider._id": provider._id,
    });

    if (sort) {
      queryBuilder = queryBuilder.sort(sort);
    }

    if (lean) {
      queryBuilder = queryBuilder.lean();
    }

    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    return queryBuilder;
  }

  static async findOneProvider(
    model: any,
    req: Request,
    query: any = {},
    sort?: any,
    lean: boolean = false,
    limit?: any
  ) {
    const provider = (req as any).user?.provider;

    if (!provider) {
      throw new Error("Provider is required for this query");
    }

    let queryBuilder = model.findOne({
      ...query,
      "provider._id": provider._id,
    });

    if (sort) {
      queryBuilder = queryBuilder.sort(sort);
    }

    if (lean) {
      queryBuilder = queryBuilder.lean();
    }

    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    return queryBuilder;
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
