import { Request } from "express";
import { Fuel } from "../models/fuel.model";
import { GasStation } from "../models/gas-station.model";
import {
  Release,
  ReleaseOptions,
  type IRelease,
} from "../models/release-model";
import { QueryService } from "./query.service";

export class ReleaseService {
  static async create(req: Request, data: any) {
    data.createdAt = new Date();

    const fuel = await QueryService.findOneProvider(Fuel, req, {
      _id: data.fuel.type._id,
    });

    const gasStation = await QueryService.findOneProvider(GasStation, req, {
      _id: data.gasStation._id,
    });

    if (!fuel || !gasStation) {
      throw new Error("Fuel or GasStation not found");
    }

    data.fuel.type = fuel;
    data.gasStation = gasStation;

    const lastRelease = await QueryService.findOneProvider(
      Release,
      req,
      {},
      { createdAt: -1 },
      true
    );

    this.validateLastRelease(data, lastRelease);

    if (data.type.name === "entrada") {
      this.handleEntryRelease(data, lastRelease);
    } else if (data.type.name === "saída") {
      await this.handleExitRelease(req, data, lastRelease);
    } else if (data.type.name === "fechamento") {
      await this.handleClosureRelease(req, data);
    } else if (data.type.name === "correção") {
      await this.handleCorrectionRelease(req, data);
    }

    return await QueryService.createProvider(Release, req, data);
  }

  static async find(
    req: Request,
    fuelId: string,
    gasStationId: string,
    limit: number
  ) {
    const query: any = {};

    if (fuelId) query["fuel.type._id"] = fuelId;
    if (gasStationId) query["gasStation._id"] = gasStationId;

    return await QueryService.findProvider(
      Release,
      req,
      {},
      { createdAt: -1 },
      false,
      limit
    );
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

  static async handleExitRelease(req: Request, data: any, lastRelease: any) {
    const lastEntry = await QueryService.findOneProvider(
      Release,
      req,
      { "type.name": "entrada" },
      { createdAt: -1 },
      true
    );

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

  static async handleClosureRelease(req: Request, data: any) {
    const lastEntry = await QueryService.findOneProvider(
      Release,
      req,
      { "type.name": "entrada" },
      { createdAt: -1 },
      true
    );

    if (!lastEntry) {
      throw new Error("No previous entry found");
    }

    const fuelOutlets = await QueryService.findProvider(
      Release,
      req,
      {
        "type.name": "saída",
        createdAt: { $gt: lastEntry.createdAt },
      },
      {},
      true
    );

    const totalFuelOutlets = fuelOutlets.reduce(
      (total: number, release: IRelease) =>
        total + parseFloat(release?.fuel?.outlet || "0"),
      0
    );

    const differenceFuel =
      parseFloat(data.fuel.outlet || "0") - totalFuelOutlets;

    if (differenceFuel !== 0) {
      data.differenceFuel = String(differenceFuel);
    }

    const lastEntryFuelInlet = parseFloat(lastEntry?.fuel?.inlet || "0");
    data.totalFuel = String(lastEntryFuelInlet - data.fuel.outlet);

    const fuelCost = parseFloat(lastEntry?.fuel.cost || "0");
    const fuelPrice = parseFloat(lastEntry?.fuel.price || "0");
    data.fuel.cost = String(fuelCost);
    data.fuel.price = String(fuelPrice);

    const totalProfitFuelOutlets = fuelOutlets.reduce(
      (total: number, release: IRelease) =>
        total +
        parseFloat(release?.fuel?.outlet || "0") *
          parseFloat(release?.fuel?.price || "0"),
      0
    );

    const lastEntryTotalProfit = parseFloat(lastEntry.totalProfit || "0");
    const totalProfitFuelOutlet = parseFloat(totalProfitFuelOutlets || "0");
    data.totalProfit = String(lastEntryTotalProfit + totalProfitFuelOutlet);
  }

  static async handleCorrectionRelease(req: Request, data: any) {
    const lastClosure = await QueryService.findOneProvider(
      Release,
      req,
      { "type.name": "fechamento" },
      { createdAt: -1 },
      true
    );

    if (lastClosure) {
      const lastEntry = await QueryService.findOneProvider(
        Release,
        req,
        { "type.name": "entrada" },
        { createdAt: -1 },
        true
      );

      if (!lastEntry) {
        throw new Error("No previous entry found");
      }

      const fuelOutlets = await QueryService.findProvider(
        Release,
        req,
        {
          "type.name": "saída",
          createdAt: { $gt: lastEntry.createdAt },
        },
        {},
        true
      );

      const totalFuelOutlets = fuelOutlets.reduce(
        (total: number, release: IRelease) =>
          total + parseFloat(release?.fuel?.outlet || "0"),
        0
      );

      const lastEntryTotalFuel = parseFloat(lastEntry?.totalFuel || "0");
      data.totalFuel = String(lastEntryTotalFuel - totalFuelOutlets);

      const fuelCost = parseFloat(lastEntry?.fuel.cost || "0");
      const fuelPrice = parseFloat(lastEntry?.fuel.price || "0");
      data.fuel.cost = String(fuelCost);
      data.fuel.price = String(fuelPrice);

      const totalProfitFuelOutlets = fuelOutlets.reduce(
        (total: number, release: IRelease) =>
          total +
          parseFloat(release?.fuel?.outlet || "0") *
            parseFloat(release?.fuel?.price || "0"),
        0
      );

      const lastEntryTotalProfit = parseFloat(lastEntry.totalProfit || "0");
      const totalProfitFuelOutlet = parseFloat(totalProfitFuelOutlets || "0");
      data.totalProfit = String(lastEntryTotalProfit + totalProfitFuelOutlet);
    }
  }
}
