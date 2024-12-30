import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/async-handler";

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", asyncHandler(AuthController.create));
    this.router.get("/", authenticate, asyncHandler(AuthController.find));
  }
}

export default new AuthRouter().router;
