import { Router } from "express";
import { FuelController } from "../controllers/fuel.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/async-handler";

class FuelRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticate, asyncHandler(FuelController.create));
    this.router.get("/", authenticate, asyncHandler(FuelController.find));
    this.router.put(
      "/status",
      authenticate,
      asyncHandler(FuelController.findByIdAndUpdate)
    );
  }
}

export default new FuelRoute().router;
