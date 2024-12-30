import { Request, Response } from "express";
import { Profile } from "../models/profile.model";

export class ProfileController {
  static async find(req: Request, res: Response) {
    try {
      const profiles = await Profile.find();
      return res.json({ profiles });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
