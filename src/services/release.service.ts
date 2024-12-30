import { Fuel } from "../models/fuel.model";
import { GasStation } from "../models/gas-station.model";
import { Release, ReleaseOptions } from "../models/release-model";

export class ReleaseService {
  static async create(data: any) {
    data.createdAt = new Date();

    const fuel = await Fuel.findOne({ _id: data.fuel.type._id });
    const gasStation = await GasStation.findOne({ _id: data.gasStation._id });

    if (!fuel || !gasStation) {
      throw new Error("Fuel or GasStation not found");
    }

    data.fuel.type = fuel;
    data.gasStation = gasStation;

    const lastRelease = await Release.findOne().sort({ createdAt: -1 }).lean();
    this.validateLastRelease(data, lastRelease);

    if (data.type.name === "entrada") {
      this.handleEntryRelease(data, lastRelease);
    } else if (data.type.name === "saída") {
      await this.handleExitRelease(data, lastRelease);
    } else if (data.type.name === "fechamento") {
      await this.handleClosureRelease(data);
    } else if (data.type.name === "correção") {
      await this.handleCorrectionRelease(data);
    }

    return await Release.create(data);
  }

  static async find(fuelId: string, gasStationId: string, limit: number) {
    const query: any = {};

    if (fuelId) query["fuel.type._id"] = fuelId;
    if (gasStationId) query["gasStation._id"] = gasStationId;

    return await Release.find(query).sort({ createdAt: -1 }).limit(limit);
  }

  static async findOptions() {
    return await ReleaseOptions.find();
  }

  static validateLastRelease(data: any, lastRelease: any) {
    if (data.type.name !== "correção" && lastRelease?.differenceFuel) {
      throw new Error(
        "The last release has a discrepancy. Please resolve it before proceeding."
      );
    }
  }

  static handleEntryRelease(data: any, lastRelease: any) {
    const inletFuel = parseFloat(data.fuel.inlet || "0");
    const costFuel = parseFloat(data.fuel.cost || "0");
    const lastReleaseTotalFuel = parseFloat(lastRelease?.totalFuel || "0");

    data.totalFuel = String(lastReleaseTotalFuel + inletFuel);

    const totalProfit = inletFuel * -costFuel;
    const lastReleaseTotalProfit = parseFloat(lastRelease?.totalProfit || "0");

    data.totalProfit = String(lastReleaseTotalProfit + totalProfit);
  }

  static async handleExitRelease(data: any, lastRelease: any) {
    const lastEntry = await Release.findOne({ "type.name": "entrada" })
      .sort({ createdAt: -1 })
      .lean();

    if (!lastEntry) {
      throw new Error("No previous entry found");
    }

    const fuelOutlet = parseFloat(data.fuel.outlet || "0");
    const lastReleaseTotalFuel = parseFloat(lastRelease?.totalFuel || "0");

    data.totalFuel = String(lastReleaseTotalFuel - fuelOutlet);

    const fuelCost = parseFloat(lastEntry?.fuel.cost || "0");
    const fuelPrice = parseFloat(lastEntry?.fuel.price || "0");
    const lastReleaseTotalProfit = parseFloat(lastRelease?.totalProfit || "0");

    data.fuel.cost = String(fuelCost);
    data.fuel.price = String(fuelPrice);

    const totalProfit = fuelOutlet * fuelPrice;
    data.totalProfit = String(lastReleaseTotalProfit + totalProfit);
  }

  static async handleClosureRelease(data: any) {
    const lastEntry = await Release.findOne({ "type.name": "entrada" })
      .sort({ createdAt: -1 })
      .lean();

    if (!lastEntry) {
      throw new Error("No previous entry found");
    }

    const fuelOutlets = await Release.find({
      "type.name": "saída",
      createdAt: { $gt: lastEntry.createdAt },
    }).lean();

    const totalFuelOutlets = fuelOutlets.reduce(
      (total, fuel) => total + parseFloat(fuel?.fuel?.outlet || "0"),
      0
    );

    const differenceFuel =
      parseFloat(data.fuel.outlet || "0") - totalFuelOutlets;

    if (differenceFuel !== 0) {
      data.differenceFuel = String(differenceFuel);
    }

    const fuelCost = parseFloat(lastEntry?.fuel.cost || "0");
    const fuelPrice = parseFloat(lastEntry?.fuel.price || "0");
    const lastEntryFuelInlet = parseFloat(lastEntry?.fuel?.inlet || "0");

    data.totalFuel = String(lastEntryFuelInlet - data.fuel.outlet);
    data.fuel.cost = String(fuelCost);
    data.fuel.price = String(fuelPrice);

    data.totalProfit = String(parseFloat(lastEntry.totalProfit || "0"));
  }

  static async handleCorrectionRelease(data: any) {
    const lastClosure = await Release.findOne({
      "type.name": "fechamento",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (lastClosure) {
      const lastEntry = await Release.findOne({ "type.name": "entrada" })
        .sort({ createdAt: -1 })
        .lean();

      if (!lastEntry) {
        throw new Error("No previous entry found");
      }

      const fuelOutlets = await Release.find({
        "type.name": "saída",
        createdAt: { $gt: lastEntry.createdAt },
      }).lean();

      const totalFuelOutlets = fuelOutlets.reduce(
        (total, fuel) => total + parseFloat(fuel?.fuel?.outlet || "0"),
        0
      );

      lastClosure.fuel.outlet = String(totalFuelOutlets);
      lastClosure.totalFuel = String(
        parseFloat(lastEntry.totalFuel || "0") - totalFuelOutlets
      );
      lastClosure.type = data.type;

      data = lastClosure;
    }
  }
}
