import express from "express";
import cors from "cors";

import { corsOptions } from "./middlewares/cors.middleware";
import { connectDB } from "./configs/database";

import AuthRoute from "./routes/auth-route";
import GasStationRoute from "./routes/gas-station.route";
import FuelRoute from "./routes/fuel.route";
import UserRoute from "./routes/user-route";
import ProfileRoute from "./routes/profile.route";
import releaseRoute from "./routes/release.route";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "https://olin-web.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://olin-web.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());

app.use("/v1/login", AuthRoute);
app.use("/v1/releases", releaseRoute);
app.use("/v1/gas-stations", GasStationRoute);
app.use("/v1/fuels", FuelRoute);
app.use("/v1/users", UserRoute);
app.use("/v1/profiles", ProfileRoute);

export default app;
