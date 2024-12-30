import { Router } from "express";
import { ReleaseController } from "../controllers/release.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/async-handler";

class ProfileRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticate, asyncHandler(ReleaseController.create));
    this.router.get("/", authenticate, asyncHandler(ReleaseController.find));
    this.router.get(
      "/options",
      authenticate,
      asyncHandler(ReleaseController.findOptions)
    );
  }
}

export default new ProfileRoute().router;
