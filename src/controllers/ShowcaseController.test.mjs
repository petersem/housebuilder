import { jest } from '@jest/globals';

import { ShowcaseController } from "./ShowcaseController.mjs";
import ShowcaseModel from "../models/ShowcaseModel.mjs";

// Mock ALL models the controller imports
jest.mock("../models/ShowcaseModel.mjs", () => ({
  __esModule: true,
  default: {
    select: jest.fn()
  }
}));

jest.mock("../models/PricingModel.mjs", () => ({
  __esModule: true,
  default: {
    select: jest.fn()
  }
}));

jest.mock("../models/CompanyModel.mjs", () => ({
  __esModule: true,
  default: {
    select: jest.fn()
  }
}));

// Mock logger
jest.mock("../utilities/logger.mjs", () => ({
  logDanger: "danger",
  logWarning: "warning",
  logInfo: "info"
}));

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn()
  };
}

describe("ShowcaseController.readShowcase", () => {
  it("returns showcase data with status 200", () => {
    const mockShowcase = [
      { id: 1, title: "Modern Home", description: "A beautiful house" }
    ];

    ShowcaseModel.select.mockReturnValue(mockShowcase);

    const req = {};
    const res = mockRes();

    ShowcaseController.readShowcase(req, res);

    expect(ShowcaseModel.select).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: mockShowcase
    });
  });
});
