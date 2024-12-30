import { Request, Response } from "express";
import { FuelService } from "../services/fuel.service";

export class FuelController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const fuel = await FuelService.create(req, data);
      return res.status(201).json(fuel);
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const fuels = await FuelService.find(req, status);
      return res.json({ fuels });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async findByIdAndUpdate(req: Request, res: Response) {
    try {
      const updatedFuel = await FuelService.findByIdAndUpdate(req.body);

      if (!updatedFuel) {
        return res.status(404).json({ error: "Fuel not found" });
      }

      return res.json({ fuel: updatedFuel });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
