import { ProductModel } from "../models/ProductModel.mjs";

export class MenuController {
  static viewMenuPage(req, res) {
    res.render("menu.ejs");
  }

  static getProductsJSON(req, res) {
    const results = ProductModel.select();
    res.status(200).json(results);
  }

  static viewProductDetailsPartial(req, res) {
    const itemName = req.params.name;

    const result = ProductModel.select((p) => p.name == itemName);

    if (result.length > 0) {
      const item = result[0];

      res.render("partials/productDetails.ejs", { item });
    } else {
      res.json({ message: "Not found" });
    }
  }
}
