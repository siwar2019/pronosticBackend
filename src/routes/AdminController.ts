import express from "express";

import { Request, Response } from "express";
import { MSG } from "../util/translate/fr/translateFR";
import { URLs } from "../util/common";
import { User } from "../sqlModels/user";
import auth from "../middlewares/auth";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";


const AdminRoutes = express.Router();


export { AdminRoutes };
