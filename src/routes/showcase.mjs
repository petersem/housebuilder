import express from 'express';
import { ShowcaseController } from '../controllers/ShowcaseController.mjs';
import { query, body, param, checkSchema } from "express-validator"
import { addShowcaseValidationSchema, updateShowcaseValidationSchema, getShowcaseValidationSchema} from '../controllers/validators/showcaseSchema.mjs';

const showcaseRoutes = express.Router();



/**
 * @swagger
 * /showcase/list:
 *   get:
 *     summary: Get all showcase houses
 *     tags: [House]
 *     responses:
 *       200:
 *         description: A list of houses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "46ac80a9-3ea6-4481-b903-8b304764bc63"
 *                   title:
 *                     type: string
 *                     example: "Matt's place"
 *                   companyName:
 *                     type: string
 *                     example: "DreamBuild Homes"
 *                   rooms:
 *                     type: integer
 *                     example: 5
 *                   bathrooms:
 *                     type: integer
 *                     example: 2
 *                   garages:
 *                     type: integer
 *                     example: 1
 *                   floorAreaSqm:
 *                     type: integer
 *                     example: 300
 *                   storyCount:
 *                     type: integer
 *                     example: 2
 *                   totalCost:
 *                     type: integer
 *                     example: 721500
 *                   extras:
 *                     type: array
 *                     example: ["Built-in Wardrobe", "Double Glazing Windows"]
 */
showcaseRoutes.get("/list", ShowcaseController.viewShowcase);

/**
 * @swagger
 * /showcase/add:
 *   post:
 *     summary: add a showcase houses
 *     tags: [House]
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *     parameters:
 *       - name: Idempotency-Key
 *         in: header
 *         description: idempotency key
 *         required: true
 *         type: string
 *       - in: requestBody
 *         name: house
 *         required: true
 *         description: House object to add
 *     responses:
 *       201:
 *         description: created
 */
showcaseRoutes.post("/add", checkSchema(addShowcaseValidationSchema), ShowcaseController.createHouse);
showcaseRoutes.delete("/delete", ShowcaseController.deleteHouse);
showcaseRoutes.put("/update",checkSchema(updateShowcaseValidationSchema), ShowcaseController.updateHouse);

/**
 * @swagger
 * /showcase/{houseId}:
 *   get:
 *     summary: Get showcase house
 *     tags: [House]
 *     parameters:
 *       - in: path
 *         name: houseId
 *         schema:
 *           type: string
 *           example: "46ac80a9-3ea6-4481-b903-8b304764bc63"
 *         required: true
 *         description: House ID to get
 *     responses:
 *       200:
 *         description: Get a house
 *         content:
 *           application/json:
 *             schema:
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "46ac80a9-3ea6-4481-b903-8b304764bc63"
 *                   title:
 *                     type: string
 *                     example: "Matt's place"
 *                   companyName:
 *                     type: string
 *                     example: "DreamBuild Homes"
 *                   rooms:
 *                     type: integer
 *                     example: 5
 *                   bathrooms:
 *                     type: integer
 *                     example: 2
 *                   garages:
 *                     type: integer
 *                     example: 1
 *                   floorAreaSqm:
 *                     type: integer
 *                     example: 300
 *                   storyCount:
 *                     type: integer
 *                     example: 2
 *                   totalCost:
 *                     type: integer
 *                     example: 721500
 *                   extras:
 *                     type: array
 *                     example: ["Built-in Wardrobe", "Double Glazing Windows"]
 */
showcaseRoutes.get("/:houseId", checkSchema(getShowcaseValidationSchema), ShowcaseController.readHouse);

export default showcaseRoutes