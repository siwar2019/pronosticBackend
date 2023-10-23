import express from "express";
import isActive from "../middlewares/active";
import auth from "../middlewares/auth";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
import { Solde } from "../sqlModels/solde";
import { User } from "../sqlModels/user";
import isPartner from "../middlewares/partner";
import isEmployee from "../middlewares/employee";

const SoldeRoutes = express.Router();

/*            ****** Create solde  ******      */

SoldeRoutes.post(
  URLs.CREATE_SOLDE_EMPLOYEE,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    const solde = req.body.solde;
    const action = req.body.action;
    const employee_id = req.body.employee_id;

    if (!solde || !action) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }
    try {
      Solde.create({
        solde: solde,
        action: action,
        employee_id: employee_id,
      })
        .then((solde) => {
          if (!solde) {
            return res.status(400).send({ message: MSG.CREATE_ERROR });
          } else
            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
        })
        .catch((error) => {
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

SoldeRoutes.post(
  URLs.CREATE_SOLDE_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    const solde = req.body.solde;
    const action = req.body.action;
    let { id } = res.locals.currentUser as User;

    if (!solde || !action) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      Solde.create({
        solde: parseInt(solde),
        action: action,
        partner_id: id,
      })
        .then((solde) => {
          if (!solde) {
            return res.status(400).send({ message: MSG.CREATE_ERROR });
          } else
            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
        })
        .catch((error) => {
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

SoldeRoutes.post(
  URLs.ASSIGNMENT_SOLDE,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    const soldes = req.body.soldes;
    let { id } = res.locals.currentUser as User;

    if (!soldes) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    let soldesPartner = await Solde.findAll({
      where: {
        partner_id: id,
      },
      attributes: {
        exclude: ["employee_id", "createdAt", "updatedAt", "id", "partner_id"],
      },
    });

    let totalSolde: number = 0;
    soldesPartner.forEach((soldePartner) => {
      if (soldePartner.action === "add") {
        totalSolde = totalSolde + soldePartner.solde;
      } else if (soldePartner.action === "remove") {
        totalSolde = totalSolde - soldePartner.solde;
      }
    });

    try {
      let newSolde = totalSolde;
      soldes.forEach(
        (solde: { solde: string; action: string; employee: number }) => {
          Solde.create({
            solde: parseInt(solde.solde),
            action: solde.action,
            employee_id: solde.employee,
          });

          if (solde.action === "add")
            newSolde = newSolde - parseInt(solde.solde);
          else if (solde.action === "remove")
            newSolde = newSolde + parseInt(solde.solde);
        }
      );
      if (newSolde < totalSolde) {
        Solde.create({
          solde: totalSolde - newSolde,
          action: "remove",
          partner_id: id,
        });
      } else if (newSolde > totalSolde) {
        Solde.create({
          solde: newSolde - totalSolde,
          action: "add",
          partner_id: id,
        });
      } else {
      }

      return res.status(200).json({
        message: MSG.CREATE_SUCCESUFULLY,
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

SoldeRoutes.get(
  URLs.GET_PARTNER_SOLDE,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    let { id } = res.locals.currentUser as User;

    try {
      let soldesPartner = await Solde.findAll({
        where: {
          partner_id: id,
        },
        attributes: {
          exclude: [
            "employee_id",
            "createdAt",
            "updatedAt",
            "id",
            "partner_id",
          ],
        },
      });

      let totalSolde: number = 0;
      let counter = 0;
      const promise = new Promise<void>((resolve) => {
        soldesPartner.forEach((soldePartner) => {
          if (soldePartner.action === "add") {
            totalSolde = totalSolde + soldePartner.solde;
          } else if (soldePartner.action === "remove") {
            totalSolde = totalSolde - soldePartner.solde;
          }
          counter++;
        });
        if (soldesPartner.length === counter) resolve();
      });

      promise.then(() => {
        return res.status(200).json({
          totalSolde,
        });
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

SoldeRoutes.get(
  URLs.GET_EMPLOYEE_SOLDE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    let { id } = res.locals.currentUser as User;

    try {
      let soldesEmployee = await Solde.findAll({
        where: {
          employee_id: id,
        },
        attributes: {
          exclude: [
            "employee_id",
            "createdAt",
            "updatedAt",
            "id",
            "partner_id",
          ],
        },
      });

      let totalSolde: number = 0;
      let counter = 0;
      const promise = new Promise<void>((resolve) => {
        soldesEmployee.forEach((soldeEmployee) => {
          if (soldeEmployee.action === "add") {
            totalSolde = totalSolde + soldeEmployee.solde;
          } else if (soldeEmployee.action === "remove") {
            totalSolde = totalSolde - soldeEmployee.solde;
          }
          counter++;
        });
        if (soldesEmployee.length === counter) resolve();
      });

      promise.then(() => {
        return res.status(200).json({
          totalSolde,
        });
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { SoldeRoutes };
