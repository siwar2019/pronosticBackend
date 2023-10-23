import { app } from "./app";
import * as http from "http";
import { sequelize } from "./sequelize";
const port = process.env.PORT;
const swaggerUi = require("swagger-ui-express");
// swaggerDocument = require('../swagger.json');
const swaggerDocs = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const connexion = (async () => {
  await sequelize.sync();
  http
    .createServer(app)
    .listen(port, () => console.info(`Server running on port ${port}`));
})();
export { connexion };
