import { jest } from '@jest/globals';

import { CompanyController } from "../../controllers/CompanyController.mjs";
import CompanyModel from "../../models/CompanyModel.mjs";

// Mock model
jest.mock("../models/CompanyModel.mjs");

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

describe("CompanyController.viewCompanies", () => {
  it("returns all companies with status 200", () => {
    const mockCompanies = [
      { id: 1, name: "DreamHomes", basePrice: 50000 }
    ];

    CompanyModel.select.mockReturnValue(mockCompanies);

    const req = {};
    const res = mockRes();

    CompanyController.viewCompanies(req, res);

    expect(CompanyModel.select).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: mockCompanies
    });
  });
});
