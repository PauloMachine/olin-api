import { Router } from "express";
import { GasStationController } from "../controllers/gas-station.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/async-handler";

class GasStationRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      authenticate,
      asyncHandler(GasStationController.create)
    );
    this.router.get("/", authenticate, asyncHandler(GasStationController.find));
    this.router.put(
      "/status",
      authenticate,
      asyncHandler(GasStationController.findByIdAndUpdate)
    );
  }
}

export default new GasStationRoute().router;
