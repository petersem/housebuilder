/**
 * @file CompanyController.test.mjs
 */

// --- MOCK MUST COME FIRST ---
jest.mock("../models/CompanyModel.mjs", () => ({
  __esModule: true,
  default: {
    select: jest.fn(),
    setDataSource: jest.fn()
  }
}));

import { CompanyController } from "../controllers/CompanyController.mjs";
import CompanyModel from "../models/CompanyModel.mjs";

describe("CompanyController.viewCompanies", () => {

  let req;
  let res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      json: jest.fn()
    };
  });

  it("returns 200 and the list of companies", () => {
    const mockCompanies = [
      { name: "DreamBuild Homes", basePrice: 170000, rating: 4.5 },
      { name: "Value Builders", basePrice: 150000, rating: 4.0 }
    ];

    CompanyModel.select.mockReturnValue(mockCompanies);

    CompanyController.viewCompanies(req, res);

    expect(CompanyModel.select).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");

    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: mockCompanies
    });
  });

});
