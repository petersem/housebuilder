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
 *     parameters:
 *       - name: Idempotency-Key
 *         in: header
 *         description: idempotency key
 *         required: true
 *         type: string
 *         example: "7094aaf1-8024-4ce9-afe4-39a238fb6d3c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "46ac80a9-3ea6-4481-b903-8b304764bc63"
 *               title:
 *                 type: string
 *                 example: "Mr Potatohead's house"
 *               companyName:
 *                 type: string
 *                 example: "Dreambuild Homes"
 *               rooms:
 *                 type: integer
 *                 example: 10
 *               bathrooms:
 *                 type: integer
 *                 example: 2
 *               garages:
 *                 type: integer
 *                 example: 2
 *               floorAreaSqm:
 *                 type: integer
 *                 example: 700
 *               storyCount:
 *                 type: integer
 *                 example: 1
 *               totalCost:
 *                 type: integer
 *                 example: 875000
 *               extras:
 *                 type: array
 *                 items: string
 *                 example: [ "Built-in Wardrobe", "Double Glazing Windows", "Solar Panel Installation (Standard)"]
 *     responses:
 *       201:
 *         description: Created
 */
showcaseRoutes.post("/add", checkSchema(addShowcaseValidationSchema), ShowcaseController.createHouse);

/**
 * @swagger
 * /showcase/delete:
 *   post:
 *     summary: update a showcase houses
 *     tags: [House]
 *     parameters:
 *       - name: Idempotency-Key
 *         in: header
 *         description: idempotency key
 *         required: true
 *         type: string
 *         example: "7094aaf1-8024-4ce9-afe4-39a238fb6d3c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "46ac80a9-3ea6-4481-b903-8b304764bc63"
 *     responses:
 *       204:
 *         description: No content
 */
showcaseRoutes.delete("/delete", ShowcaseController.deleteHouse);

/**
 * @swagger
 * /showcase/update:
 *   put:
 *     summary: update a showcase houses
 *     tags: [House]
 *     parameters:
 *       - name: Idempotency-Key
 *         in: header
 *         description: idempotency key
 *         required: true
 *         type: string
 *         example: "7094aaf1-8024-4ce9-afe4-39a238fb6d3c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "46ac80a9-3ea6-4481-b903-8b304764bc63"
 *               title:
 *                 type: string
 *                 example: "Mr Potatohead's house"
 *               companyName:
 *                 type: string
 *                 example: "Dreambuild Homes"
 *               rooms:
 *                 type: integer
 *                 example: 10
 *               bathrooms:
 *                 type: integer
 *                 example: 2
 *               garages:
 *                 type: integer
 *                 example: 2
 *               floorAreaSqm:
 *                 type: integer
 *                 example: 700
 *               storyCount:
 *                 type: integer
 *                 example: 1
 *               totalCost:
 *                 type: integer
 *                 example: 875000
 *               extras:
 *                 type: array
 *                 items: string
 *                 example: [ "Built-in Wardrobe", "Double Glazing Windows", "Solar Panel Installation (Standard)"]
 *     responses:
 *       204:
 *         description: No content
 */
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