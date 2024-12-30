import express from "express";
import cors from "cors";

import { corsOlin } from "./middlewares/cors.middleware";
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

app.use(express.json());
app.use(cors(corsOlin));

app.use("/v1/login", AuthRoute);
app.use("/v1/releases", releaseRoute);
app.use("/v1/gas-stations", GasStationRoute);
app.use("/v1/fuels", FuelRoute);
app.use("/v1/users", UserRoute);
app.use("/v1/profiles", ProfileRoute);

export default app;
