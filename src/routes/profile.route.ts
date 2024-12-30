import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/async-handler";

class ProfileRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", authenticate, asyncHandler(ProfileController.find));
  }
}

export default new ProfileRoute().router;
