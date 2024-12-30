import express from "express";
import cors from "cors";

import { connectDB } from "./configs/database";

import AuthRoute from "./routes/auth-route";
import GasStationRoute from "./routes/gas-station.route";
import FuelRoute from "./routes/fuel.route";
import UserRoute from "./routes/user-route";
import ProfileRoute from "./routes/profile.route";
import releaseRoute from "./routes/release.route";
import { corsOlin } from "./middlewares/cors.middleware";

const app = express();

connectDB();

app.use(cors(corsOlin));
app.options("*", cors());

app.use(express.json());
app.use("/v1/login", AuthRoute);
app.use("/v1/releases", releaseRoute);
app.use("/v1/gas-stations", GasStationRoute);
app.use("/v1/fuels", FuelRoute);
app.use("/v1/users", UserRoute);
app.use("/v1/profiles", ProfileRoute);

if (process.env.ENV === "DEV") {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

export default app;
