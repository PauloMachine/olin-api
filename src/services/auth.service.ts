import jwt from "jsonwebtoken";
import { User, type IProvider } from "../models/user.model";

export class AuthService {
  static async findOne(username: string, password: string) {
    const user = await User.findOne({ username, status: true });
    if (!user || !(await user.comparePassword(password))) {
      return null;
    }

    const token = jwt.sign(
      { userId: user._id, provider: user.provider },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        status: user.status,
        profile: user.profile,
        provider: user.provider,
      },
    };
  }

  static async findOneByToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
        userId: string;
        provider: IProvider;
      };

      const user = await User.findOne({
        _id: decoded.userId,
        "provider._id": decoded.provider._id,
      }).select("-password");

      return user;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
