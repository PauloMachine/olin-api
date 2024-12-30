import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "../middlewares/async-handler";

class UserRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authenticate, asyncHandler(UserController.create));
    this.router.get("/", authenticate, asyncHandler(UserController.find));
    this.router.put(
      "/status",
      authenticate,
      asyncHandler(UserController.findByIdAndUpdate)
    );
  }
}

export default new UserRoute().router;
