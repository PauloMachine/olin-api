import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async create(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const loginResponse = await AuthService.findOne(username, password);
      if (!loginResponse) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.json({ data: loginResponse });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token is required" });
      }

      const token = authHeader.split(" ")[1];

      try {
        const user = await AuthService.findOneByToken(token);
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        return res.json(user);
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}
