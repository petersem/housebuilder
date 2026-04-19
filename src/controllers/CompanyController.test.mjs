import { jest } from "@jest/globals";

// 1. Mock DataModel FIRST — before CompanyModel loads
jest.mock("../models/DataModel.mjs", () => ({
  __esModule: true,
  default: class {
    static _data = [];
    static _source = [];
    static select = jest.fn();
    static setDataSource = jest.fn();
  }
}));

// 2. Mock CompanyModel — now it inherits the mocked DataModel
jest.mock("../models/CompanyModel.mjs", () => ({
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
import { CompanyController } from "./CompanyController.mjs";
import CompanyModel from "../models/CompanyModel.mjs";

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
    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: mockCompanies
    });
  });
});
