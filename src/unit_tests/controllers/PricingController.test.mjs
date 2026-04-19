import { jest } from '@jest/globals';

import { PricingController } from "../../controllers/PricingController.mjs";
import PricingModel from "../../models/PricingModel.mjs";

// Mock model
jest.mock("../models/PricingModel.mjs");

// Mock logger (silence output)
jest.mock("../utilities/logger.mjs", () => ({
  logDanger: "danger",
  logWarning: "warning",
  logInfo: "info"
}));

// Mock Express response object
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
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: mockPricing
    });
  });
});
