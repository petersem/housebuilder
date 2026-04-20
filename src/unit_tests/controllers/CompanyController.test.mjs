/**
 * @file CompanyController.test.mjs
 */

import { jest } from '@jest/globals';

// MUST MOCK DATAMODEL FIRST
jest.mock("../../models/DataModel.mjs", () => ({
  __esModule: true,
  default: {
    select: jest.fn(),
    setDataSource: jest.fn()
  }
}));

// THEN MOCK COMPANYMODEL
jest.mock("../../models/CompanyModel.mjs", () => ({
  __esModule: true,
  default: {
    select: jest.fn(),
    setDataSource: jest.fn()
  }
}));

// --- Mock logger to avoid side effects ---
jest.mock('../../utilities/logger.mjs', () => ({
    logDanger: jest.fn(),
    logWarning: jest.fn(),
    logInfo: jest.fn()
}));

import CompanyModel from '../../models/CompanyModel.mjs';
import { CompanyController } from '../../controllers/CompanyController.mjs';


// --- Reusable mock response object ---
const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


describe('CompanyController.viewCompanies', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200, sets JSON header, and returns company data', () => {
        const mockData = [
            { id: 1, name: 'Acme Corp' },
            { id: 2, name: 'Globex' }
        ];

        CompanyModel.select.mockReturnValue(mockData);

        const req = {};
        const res = createMockRes();

        CompanyController.viewCompanies(req, res);

        expect(CompanyModel.select).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

        expect(res.json).toHaveBeenCalledWith({
            message: 'records retrieved',
            data: mockData
        });
    });

    it('handles empty result sets correctly', () => {
        CompanyModel.select.mockReturnValue([]);

        const req = {};
        const res = createMockRes();

        CompanyController.viewCompanies(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'records retrieved',
            data: []
        });
    });
});
