import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const user = await UserService.create(req, data);
      return res.status(201).json(user);
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const users = await UserService.find(req);
      return res.json({ users });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async findByIdAndUpdate(req: Request, res: Response) {
    try {
      const { _id, status } = req.body;
      const updatedUser = await UserService.findByIdAndUpdate(_id, status);

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({ user: updatedUser });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
