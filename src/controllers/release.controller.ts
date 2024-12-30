import { Request, Response } from "express";
import { ReleaseService } from "../services/release.service";

export class ReleaseController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const release = await ReleaseService.create(req, data);
      return res.status(201).json(release);
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const { fuelId, gasStationId, pageSize } = req.query;

      if (!fuelId || !gasStationId) {
        return res
          .status(404)
          .json({ error: "fuelId and gasStationId not found" });
      }

      const limit = parseInt(pageSize as string, 10) || 10;

      const releases = await ReleaseService.find(
        req,
        fuelId as string,
        gasStationId as string,
        limit
      );

      return res.json({ releases });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async findOptions(req: Request, res: Response) {
    try {
      const releaseOptions = await ReleaseService.findOptions();
      return res.json({ releaseOptions });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
