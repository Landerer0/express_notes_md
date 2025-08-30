import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { Express } from "express";
import { JsonObject } from "swagger-ui-express";

export function setupSwagger(app: Express) {
  const swaggerPath = path.join(__dirname, "./docs/swagger.yaml");
  const swaggerDocument = yaml.load(
    fs.readFileSync(swaggerPath, "utf8")
  ) as JsonObject;
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
