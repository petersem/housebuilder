import { jest } from '@jest/globals';

/**
 * Jest unit tests for ShowcaseController (ESM)
 * ---------------------------------------------------------
 * - All models are mocked
 * - express-validator is mocked
 * - Response object is mocked with spies
 * - Tests cover success, failure, and edge cases
 */

import { ShowcaseController } from "../../controllers/ShowcaseController.mjs";
import ShowcaseModel from "../../models/ShowcaseModel.mjs";
import PricingModel from "../../models/PricingModel.mjs";
import CompanyModel from "../../models/CompanyModel.mjs";
import { validationResult } from "express-validator";

// Mock all model modules
jest.mock("../../models/ShowcaseModel.mjs");
jest.mock("../../models/PricingModel.mjs");
jest.mock("../../models/CompanyModel.mjs");

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn()
}));

// Mock logger (no console noise)
jest.mock("../../utilities/logger.mjs", () => ({
  logDanger: "danger",
  logWarning: "warning",
  logInfo: "info"
}));

// Helper: mock Express response object
function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn()
  };
}

//
// ---------------------------------------------------------
//  checkValidationErrors
// ---------------------------------------------------------
//
describe("ShowcaseController.checkValidationErrors", () => {
  it("returns formatted errors when validation fails", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { location: "body", path: "title", value: "", msg: "Title required" }
      ]
    });

    const req = {};
    const res = {};
    const result = ShowcaseController.checkValidationErrors(req, res);

    expect(result).toEqual([
      {
        location: "body",
        field: "title",
        value: "",
        msg: "Title required"
      }
    ]);
  });

  it("returns undefined when no validation errors", () => {
    validationResult.mockReturnValue({
      isEmpty: () => true
    });

    const result = ShowcaseController.checkValidationErrors({}, {});
    expect(result).toBeUndefined();
  });
});

//
// ---------------------------------------------------------
//  costCalculator
// ---------------------------------------------------------
//
describe("ShowcaseController.costCalculator", () => {
  it("calculates total cost correctly", () => {
    PricingModel.select.mockReturnValue([
      {
        perRoom: 1000,
        perBathroom: 2000,
        perGarage: 3000,
        perSqm: 10,
        extras: [
          { extra: "pool", price: 15000 },
          { extra: "solar", price: 8000 }
        ]
      }
    ]);

    CompanyModel.select.mockReturnValue([
      { name: "DreamHomes", basePrice: 50000 }
    ]);

    const house = {
      companyName: "DreamHomes",
      rooms: 3,
      bathrooms: 2,
      garages: 1,
      floorAreaSqm: 200,
      extras: ["pool", "solar"]
    };

    const total = ShowcaseController.costCalculator(house);

    expect(total).toBe(
      50000 + // base
      3 * 1000 +
      2 * 2000 +
      1 * 3000 +
      200 * 10 +
      15000 +
      8000
    );
  });
});

//
// ---------------------------------------------------------
//  viewShowcase
// ---------------------------------------------------------
//
describe("ShowcaseController.viewShowcase", () => {
  it("returns all showcase houses", () => {
    ShowcaseModel.select.mockReturnValue([{ id: 1, title: "Test House" }]);

    const req = {};
    const res = mockRes();

    ShowcaseController.viewShowcase(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "records retrieved",
      data: [{ id: 1, title: "Test House" }]
    });
  });
});

//
// ---------------------------------------------------------
//  readHouse
// ---------------------------------------------------------
//
describe("ShowcaseController.readHouse", () => {
  it("returns 400 when validation errors exist", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { location: "params", path: "houseId", value: "", msg: "Invalid ID" }
      ]
    });

    const req = { params: { houseId: "1" } };
    const res = mockRes();

    ShowcaseController.readHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalled();
  });

  it("returns 404 when house not found", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    ShowcaseModel.select.mockReturnValue([]);

    const req = { params: { houseId: "999" } };
    const res = mockRes();

    ShowcaseController.readHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "record not found",
      data: "999"
    });
  });

  it("returns 200 when house is found", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    ShowcaseModel.select.mockReturnValue([{ id: 1 }]);
    PricingModel.select.mockReturnValue([]);
    CompanyModel.select.mockReturnValue([]);

    const req = { params: { houseId: "1" } };
    const res = mockRes();

    ShowcaseController.readHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "record retrieved",
      data: [{ id: 1 }]
    });
  });
});

//
// ---------------------------------------------------------
//  updateHouse
// ---------------------------------------------------------
//
describe("ShowcaseController.updateHouse", () => {
  it("returns 400 when validation errors exist", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: "id", msg: "Invalid" }]
    });

    const req = { body: {} };
    const res = mockRes();

    ShowcaseController.updateHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 201 when update succeeds", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    ShowcaseModel.update.mockReturnValue(1);

    const req = {
      body: {
        id: 1,
        title: "Updated",
        companyName: "Co",
        rooms: 3,
        bathrooms: 2,
        garages: 1,
        floorAreaSqm: 100,
        storyCount: 1,
        totalCost: 12345,
        extras: []
      }
    };
    const res = mockRes();

    ShowcaseController.updateHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("returns 204 when record not found", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    ShowcaseModel.update.mockReturnValue(0);

    const req = { body: { id: 999 } };
    const res = mockRes();

    ShowcaseController.updateHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });
});

//
// ---------------------------------------------------------
//  createHouse
// ---------------------------------------------------------
//
describe("ShowcaseController.createHouse", () => {
  it("returns 400 when validation errors exist", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: "title", msg: "Required" }]
    });

    const req = { body: {} };
    const res = mockRes();

    ShowcaseController.createHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates a house successfully", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    ShowcaseModel.insert.mockReturnValue(true);

    const req = {
      body: {
        id: 1,
        title: "New House",
        companyName: "Co",
        rooms: 3,
        bathrooms: 2,
        garages: 1,
        floorAreaSqm: 100,
        storyCount: 1,
        totalCost: 12345,
        extras: []
      }
    };
    const res = mockRes();

    ShowcaseController.createHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("handles insert errors", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    ShowcaseModel.insert.mockImplementation(() => {
      throw new Error("Insert failed");
    });

    const req = { body: {} };
    const res = mockRes();

    expect(() => ShowcaseController.createHouse(req, res)).toThrow();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

//
// ---------------------------------------------------------
//  deleteHouse
// ---------------------------------------------------------
//
describe("ShowcaseController.deleteHouse", () => {
  it("returns 204 when delete succeeds", () => {
    ShowcaseModel.delete.mockReturnValue(1);

    const req = { body: { houseId: 1 } };
    const res = mockRes();

    ShowcaseController.deleteHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("returns 404 when record not found", () => {
    ShowcaseModel.delete.mockReturnValue(0);

    const req = { body: { houseId: 999 } };
    const res = mockRes();

    ShowcaseController.deleteHouse(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "record not found" });
  });
});
