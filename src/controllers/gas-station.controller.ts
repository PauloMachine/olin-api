import { Request, Response } from "express";
import { GasStationService } from "../services/gas-station.service";

export class GasStationController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const gasStation = await GasStationService.create(req, data);
      return res.status(201).json(gasStation);
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const gasStations = await GasStationService.find(req, status);
      return res.json({ gasStations });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async findByIdAndUpdate(req: Request, res: Response) {
    try {
      const updatedGasStation = await GasStationService.findByIdAndUpdate(
        req.body
      );

      if (!updatedGasStation) {
        return res.status(404).json({ error: "Gas Station not found" });
      }

      return res.json({ fuel: updatedGasStation });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
