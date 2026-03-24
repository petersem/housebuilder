import express from 'express';
import { CompanyController } from '../controllers/CompanyController.mjs';
import { query, body, param, checkSchema } from "express-validator"

const companyRoutes = express.Router();

companyRoutes.get("/", CompanyController.viewCompanies);

export default companyRoutes