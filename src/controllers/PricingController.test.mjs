import { jest } from "@jest/globals";

// 1. Mock DataModel FIRST — before any model loads
jest.mock("../models/DataModel.mjs", () => ({
  __esModule: true,
  default: class {
    static _data = [];
    static _source = [];
    static select = jest.fn();
    static setDataSource = jest.fn();
  }
}));

// 2. Mock ALL models that extend DataModel
jest.mock("../models/PricingModel.mjs", () => ({
  __esModule: true,
  default: class {
    static _data = [];
    static _source = [];
    static select = jest.fn();
    static setDataSource = jest.fn();
  }
}));

jest.mock("../models/CompanyModel.mjs", () => ({
  __esModule: true,
  default: class {
    static _data = [];
    static _source = [];
    static select = jest.fn();
    static setDataSource = jest.fn();
  }
}));

jest.mock("../models/ShowcaseModel.mjs", () => ({
  __esModule: true,
  default: class {
    static _data = [];
    static _source = [];
    static select = jest.fn();
    static setDataSource = jest.fn();
  }
}));

jest.mock("../utilities/logger.mjs", () => ({
  logDanger: "danger",
  logWarning: "warning",
  logInfo: "info"
}));

// 3. Import AFTER mocks
import { PricingController } from "./PricingController.mjs";
import PricingModel from "../models/PricingModel.mjs";

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn()
  };
}

describe("PricingController.readPrice", () => {
  it("returns pricing data with status 200", () => {
    const mockPricing = [
      { perRoom: 1000, perBathroom: 2000, perGarage: 3000 }
    ];

    PricingModel.select.mockReturnValue(mockPricing);

    const req = {};
    const res = mockRes();

    PricingController.readPrice(req, res);

    expect(PricingModel.select).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: mockPricing
    });
  });
});
