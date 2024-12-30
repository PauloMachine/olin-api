import { User } from "../models/user.model";
import { QueryService } from "./query.service";
import { Request } from "express";

export class UserService {
  static async create(req: Request, data: any) {
    data.status = true;
    return await QueryService.createProvider(User, req, data);
  }

  static async find(req: Request) {
    const users = await QueryService.findProvider(User, req);
    return users.map((user: any) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });
  }

  static async findByIdAndUpdate(_id: string, status: boolean) {
    return await User.findByIdAndUpdate(_id, { status }, { new: true });
  }
}
