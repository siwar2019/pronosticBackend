import express from "express";
import { URLs } from "../util/common";
import isActive from "../middlewares/active";
import auth from "../middlewares/auth";
import isEmployee from "../middlewares/employee";
import { User } from "../sqlModels/user";
import { MSG } from "../util/translate/fr/translateFR";
import { Draw } from "../sqlModels/draw";
import { UserEvents } from "../sqlModels/userEvents";
import isAdmin from "../middlewares/admin";
import { DrawScore } from "../sqlModels/drawScore";
import { TotalPronostics } from "../sqlModels/totalPronostics";
import { DrawSetting } from "../sqlModels/drawSetting";

const DrawRoutes = express.Router();

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1 ||
        !draw.A2 ||
        !draw.B1 ||
        !draw.B2 ||
        !draw.C1 ||
        !draw.C2 ||
        !draw.D1 ||
        !draw.D2 ||
        !draw.E1 ||
        !draw.E2 ||
        !draw.F1 ||
        !draw.F2 ||
        !draw.G1 ||
        !draw.G2 ||
        !draw.H1 ||
        !draw.H2 ||
        !draw.A1B2 ||
        !draw.B1A2 ||
        !draw.C1D2 ||
        !draw.D1C2 ||
        !draw.E1F2 ||
        !draw.F1E2 ||
        !draw.G1H2 ||
        !draw.H1G2 ||
        !draw.A1B2C1D2 ||
        !draw.B1A2D1C2 ||
        !draw.E1F2G1H2 ||
        !draw.F1E2H1G2 ||
        !draw.A1B2C1D2E1F2G1H2 ||
        !draw.B1A2D1C2F1E2H1G2 ||
        !draw.champion
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (
        draw.A1 === draw.A2 ||
        draw.B1 === draw.B2 ||
        draw.C1 === draw.C2 ||
        draw.D1 === draw.D2 ||
        draw.E1 === draw.E2 ||
        draw.F1 === draw.F2 ||
        draw.G1 === draw.G2 ||
        draw.H1 === draw.H2 ||
        draw.A1B2 === draw.B1A2 ||
        draw.C1D2 === draw.D1C2 ||
        draw.E1F2 === draw.F1E2 ||
        draw.G1H2 === draw.H1G2 ||
        draw.A1B2C1D2 === draw.B1A2D1C2 ||
        draw.E1F2G1H2 === draw.F1E2H1G2 ||
        draw.A1B2C1D2E1F2G1H2 === draw.B1A2D1C2F1E2H1G2
      ) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      if (new Date() >= new Date("2023-02-30T14:00:00")) {
        return res.status(400).send({
          message: MSG.YOU_CANT_PREDICTED,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw) {
        return res.status(400).send({
          message: MSG.YOU_CANT_PREDICTED,
        });
      }

      await Draw.create({
        ...draw,
        employee_id: id,
        event_id,
      });

      return res.status(200).send({
        message: MSG.DRAW_CREATED,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_DRAW_BY_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      const { id, company_id } = res.locals.currentUser as User;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const partner = await User.findOne({
        where: { company_id, role: "partner" },
      });
      const userEvent = await UserEvents.findOne({
        where: { user_id: partner.id, event_id },
      });
      if (!userEvent) {
        return res
          .status(400)
          .send({ success: false, message: MSG.EVENT_NOT_BUYED });
      }

      const draw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_DRAW_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_CORRECT_DRAW,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await Draw.findOne({
        where: {
          employee_id: 1,
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_ROUND_ONE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1 ||
        !draw.A2 ||
        !draw.B1 ||
        !draw.B2 ||
        !draw.C1 ||
        !draw.C2 ||
        !draw.D1 ||
        !draw.D2 ||
        !draw.E1 ||
        !draw.E2 ||
        !draw.F1 ||
        !draw.F2 ||
        !draw.G1 ||
        !draw.G2 ||
        !draw.H1 ||
        !draw.H2
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (
        draw.A1 === draw.A2 ||
        draw.B1 === draw.B2 ||
        draw.C1 === draw.C2 ||
        draw.D1 === draw.D2 ||
        draw.E1 === draw.E2 ||
        draw.F1 === draw.F2 ||
        draw.G1 === draw.G2 ||
        draw.H1 === draw.H2
      ) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      const adminDraw = await Draw.create({
        A1: Number(draw.A1),
        A2: Number(draw.A2),
        B1: Number(draw.B1),
        B2: Number(draw.B2),
        C1: Number(draw.C1),
        C2: Number(draw.C2),
        D1: Number(draw.D1),
        D2: Number(draw.D2),
        E1: Number(draw.E1),
        E2: Number(draw.E2),
        F1: Number(draw.F1),
        F2: Number(draw.F2),
        G1: Number(draw.G1),
        G2: Number(draw.G2),
        H1: Number(draw.H1),
        H2: Number(draw.H2),
        employee_id: id,
        event_id,
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;
            // A1 et A2
            if (empDram.A1 == adminDraw.A1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.A1 == adminDraw.A2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.A2 == adminDraw.A2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.A2 == adminDraw.A1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // B1 et B2
            if (empDram.B1 == adminDraw.B1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.B1 == adminDraw.B2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.B2 == adminDraw.B2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.B2 == adminDraw.B1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // C1 et C2
            if (empDram.C1 == adminDraw.C1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.C1 == adminDraw.C2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.C2 == adminDraw.C2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.C2 == adminDraw.C1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // D1 et D2
            if (empDram.D1 == adminDraw.D1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.D1 == adminDraw.D2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.D2 == adminDraw.D2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.D2 == adminDraw.D1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // E1 et E2
            if (empDram.E1 == adminDraw.E1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.E1 == adminDraw.E2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.E2 == adminDraw.E2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.E2 == adminDraw.E1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // F1 et F2
            if (empDram.F1 == adminDraw.F1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.F1 == adminDraw.F2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.F2 == adminDraw.F2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.F2 == adminDraw.F1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // G1 et G2
            if (empDram.G1 == adminDraw.G1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.G1 == adminDraw.G2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.G2 == adminDraw.G2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.G2 == adminDraw.G1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // H1 et H2
            if (empDram.H1 == adminDraw.H1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.H1 == adminDraw.H2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.H2 == adminDraw.H2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.H2 == adminDraw.H1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 1,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_ROUND_TWO,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1B2 ||
        !draw.B1A2 ||
        !draw.C1D2 ||
        !draw.D1C2 ||
        !draw.E1F2 ||
        !draw.F1E2 ||
        !draw.G1H2 ||
        !draw.H1G2
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (
        draw.A1B2 === draw.B1A2 ||
        draw.C1D2 === draw.D1C2 ||
        draw.E1F2 === draw.F1E2 ||
        draw.G1H2 === draw.H1G2
      ) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (
        employeeDraw.A1B2 &&
        employeeDraw.B1A2 &&
        employeeDraw.E1F2 &&
        employeeDraw.F1E2 &&
        employeeDraw.C1D2 &&
        employeeDraw.D1C2 &&
        employeeDraw.G1H2 &&
        employeeDraw.H1G2
      ) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          A1B2: Number(draw.A1B2),
          B1A2: Number(draw.B1A2),
          C1D2: Number(draw.C1D2),
          D1C2: Number(draw.D1C2),
          E1F2: Number(draw.E1F2),
          F1E2: Number(draw.F1E2),
          G1H2: Number(draw.G1H2),
          H1G2: Number(draw.H1G2),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // A1B2 et B1A2
            if (empDram.A1B2 == adminDraw.A1B2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.A1B2 == adminDraw.B1A2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.B1A2 == adminDraw.B1A2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.B1A2 == adminDraw.A1B2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            // C1D2 et D1C2
            if (empDram.C1D2 == adminDraw.C1D2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.C1D2 == adminDraw.D1C2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.D1C2 == adminDraw.D1C2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.D1C2 == adminDraw.C1D2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            // E1F2 et F1E2
            if (empDram.E1F2 == adminDraw.E1F2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.E1F2 == adminDraw.F1E2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.F1E2 == adminDraw.F1E2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.F1E2 == adminDraw.E1F2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            // G1H2 et H1G2
            if (empDram.G1H2 == adminDraw.G1H2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.G1H2 == adminDraw.H1G2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.H1G2 == adminDraw.H1G2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.H1G2 == adminDraw.G1H2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 2,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_ROUND_THREE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1B2C1D2 ||
        !draw.B1A2D1C2 ||
        !draw.E1F2G1H2 ||
        !draw.F1E2H1G2
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (draw.A1B2C1D2 === draw.B1A2D1C2 || draw.E1F2G1H2 === draw.F1E2H1G2) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (
        employeeDraw.A1B2C1D2 &&
        employeeDraw.B1A2D1C2 &&
        employeeDraw.E1F2G1H2 &&
        employeeDraw.F1E2H1G2
      ) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          A1B2C1D2: Number(draw.A1B2C1D2),
          B1A2D1C2: Number(draw.B1A2D1C2),
          E1F2G1H2: Number(draw.E1F2G1H2),
          F1E2H1G2: Number(draw.F1E2H1G2),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });
      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // A1B2C1D2 et B1A2D1C2
            if (empDram.A1B2C1D2 == adminDraw.A1B2C1D2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase3) as any;
            }
            if (empDram.A1B2C1D2 == adminDraw.B1A2D1C2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase3) as any;
            }
            if (empDram.B1A2D1C2 == adminDraw.B1A2D1C2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase3) as any;
            }
            if (empDram.B1A2D1C2 == adminDraw.A1B2C1D2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase3) as any;
            }

            // E1F2G1H2 et F1E2H1G2
            if (empDram.E1F2G1H2 == adminDraw.E1F2G1H2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase3) as any;
            }
            if (empDram.E1F2G1H2 == adminDraw.F1E2H1G2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase3) as any;
            }
            if (empDram.F1E2H1G2 == adminDraw.F1E2H1G2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase3) as any;
            }
            if (empDram.F1E2H1G2 == adminDraw.E1F2G1H2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase3) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 3,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_ROUND_FOUR,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1B2C1D2E1F2G1H2 ||
        !draw.B1A2D1C2F1E2H1G2
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (draw.A1B2C1D2E1F2G1H2 === draw.B1A2D1C2F1E2H1G2) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw.A1B2C1D2E1F2G1H2 && employeeDraw.B1A2D1C2F1E2H1G2) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          A1B2C1D2E1F2G1H2: Number(draw.A1B2C1D2E1F2G1H2),
          B1A2D1C2F1E2H1G2: Number(draw.B1A2D1C2F1E2H1G2),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // A1B2C1D2E1F2G1H2 et B1A2D1C2F1E2H1G2
            if (empDram.A1B2C1D2E1F2G1H2 == adminDraw.A1B2C1D2E1F2G1H2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase4) as any;
            }
            if (empDram.A1B2C1D2E1F2G1H2 == adminDraw.B1A2D1C2F1E2H1G2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase4) as any;
            }
            if (empDram.B1A2D1C2F1E2H1G2 == adminDraw.B1A2D1C2F1E2H1G2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase4) as any;
            }
            if (empDram.B1A2D1C2F1E2H1G2 == adminDraw.A1B2C1D2E1F2G1H2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase4) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 4,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_ROUND_FIVE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (!event_id || !draw || !draw.champion) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw.champion) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          champion: Number(draw.champion),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // champion
            if (empDram.champion == adminDraw.champion) {
              totalDraw = (totalDraw +
                +drawSettingPoints.correctChampion) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 5,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_TOTAL_DRAW_SCORE_EMPLOYEE_BY_EVENT,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const employees = await User.findAll({
        where: {
          company_id,
          role: "employee",
        },
        attributes: { exclude: ["password"] },
      });
      let formatData = [];
      const promise = new Promise<void>((resolve) => {
        employees.forEach(async (el, index) => {
          const data = await DrawScore.findAll({
            where: { event_id },
            include: [
              {
                model: User,
                where: { id: el.id },
              },
            ],
          });
          const sum = data.reduce((accumulator, object) => {
            return accumulator + object.point;
          }, 0);
          formatData.push({
            emp: el,
            pointsQualification: sum,
          });
          if (employees.length === formatData.length) resolve();
        });
      });

      promise.then(() => {
        return res.status(200).send(formatData);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_TOTAL_DRAW_SCORE_EMPLOYEE_BY_EVENT_BY_ADMIN,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { partner_id, event_id } = req.body;

      if (!partner_id || !event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const partner = await User.findOne({
        where: {
          id: partner_id,
        },
      });

      const employees = await User.findAll({
        where: {
          role: "employee",
        },
        attributes: { exclude: ["password"] },
      });
      let formatData = [];
      const promise = new Promise<void>((resolve) => {
        employees.forEach(async (el, index) => {
          const data = await DrawScore.findAll({
            where: { event_id },
            include: [
              {
                model: User,
                where: { id: el.id },
              },
            ],
          });
          const sum = data.reduce((accumulator, object) => {
            return accumulator + object.point;
          }, 0);
          formatData.push({
            emp: el,
            pointsQualification: sum,
          });
          if (employees.length === index + 1) resolve();
        });
      });

      promise.then(() => {
        return res.status(200).send(formatData);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_EMPLOYEE_16_TEAMS,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1 ||
        !draw.A2 ||
        !draw.B1 ||
        !draw.B2 ||
        !draw.C1 ||
        !draw.C2 ||
        !draw.D1 ||
        !draw.D2 ||
        !draw.A1B2 ||
        !draw.B1A2 ||
        !draw.C1D2 ||
        !draw.D1C2 ||
        !draw.A1B2C1D2 ||
        !draw.B1A2D1C2 ||
        !draw.champion
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (
        draw.A1 === draw.A2 ||
        draw.B1 === draw.B2 ||
        draw.C1 === draw.C2 ||
        draw.D1 === draw.D2 ||
        draw.A1B2 === draw.B1A2 ||
        draw.C1D2 === draw.D1C2 ||
        draw.A1B2C1D2 === draw.B1A2D1C2
      ) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      if (new Date() >= new Date("2023-12-30T14:00:00")) {
        return res.status(400).send({
          message: MSG.YOU_CANT_PREDICTED,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw) {
        return res.status(400).send({
          message: MSG.YOU_CANT_PREDICTED,
        });
      }

      await Draw.create({
        ...draw,
        employee_id: id,
        event_id,
      });

      return res.status(200).send({
        message: MSG.DRAW_CREATED,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_16_ROUND_ONE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1 ||
        !draw.A2 ||
        !draw.B1 ||
        !draw.B2 ||
        !draw.C1 ||
        !draw.C2 ||
        !draw.D1 ||
        !draw.D2
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (
        draw.A1 === draw.A2 ||
        draw.B1 === draw.B2 ||
        draw.C1 === draw.C2 ||
        draw.D1 === draw.D2
      ) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      const adminDraw = await Draw.create({
        A1: Number(draw.A1),
        A2: Number(draw.A2),
        B1: Number(draw.B1),
        B2: Number(draw.B2),
        C1: Number(draw.C1),
        C2: Number(draw.C2),
        D1: Number(draw.D1),
        D2: Number(draw.D2),
        employee_id: id,
        event_id,
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;
            // A1 et A2
            if (empDram.A1 == adminDraw.A1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.A1 == adminDraw.A2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.A2 == adminDraw.A2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.A2 == adminDraw.A1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // B1 et B2
            if (empDram.B1 == adminDraw.B1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.B1 == adminDraw.B2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.B2 == adminDraw.B2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.B2 == adminDraw.B1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // C1 et C2
            if (empDram.C1 == adminDraw.C1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.C1 == adminDraw.C2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.C2 == adminDraw.C2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.C2 == adminDraw.C1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // D1 et D2
            if (empDram.D1 == adminDraw.D1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.D1 == adminDraw.D2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.D2 == adminDraw.D2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.D2 == adminDraw.D1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 1,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_16_ROUND_TWO,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1B2 ||
        !draw.B1A2 ||
        !draw.C1D2 ||
        !draw.D1C2
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (draw.A1B2 === draw.B1A2 || draw.C1D2 === draw.D1C2) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (
        employeeDraw.A1B2 &&
        employeeDraw.B1A2 &&
        employeeDraw.C1D2 &&
        employeeDraw.D1C2
      ) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          A1B2: Number(draw.A1B2),
          B1A2: Number(draw.B1A2),
          C1D2: Number(draw.C1D2),
          D1C2: Number(draw.D1C2),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // A1B2 et B1A2
            if (empDram.A1B2 == adminDraw.A1B2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.A1B2 == adminDraw.B1A2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.B1A2 == adminDraw.B1A2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.B1A2 == adminDraw.A1B2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            // C1D2 et D1C2
            if (empDram.C1D2 == adminDraw.C1D2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.C1D2 == adminDraw.D1C2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.D1C2 == adminDraw.D1C2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.D1C2 == adminDraw.C1D2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 2,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_16_ROUND_THREE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (!event_id || !draw || !draw.A1B2C1D2 || !draw.B1A2D1C2) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (draw.A1B2C1D2 === draw.B1A2D1C2) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw.A1B2C1D2 && employeeDraw.B1A2D1C2) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          A1B2C1D2: Number(draw.A1B2C1D2),
          B1A2D1C2: Number(draw.B1A2D1C2),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });
      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // A1B2C1D2 et B1A2D1C2
            if (empDram.A1B2C1D2 == adminDraw.A1B2C1D2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase3) as any;
            }
            if (empDram.A1B2C1D2 == adminDraw.B1A2D1C2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase3) as any;
            }
            if (empDram.B1A2D1C2 == adminDraw.B1A2D1C2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase3) as any;
            }
            if (empDram.B1A2D1C2 == adminDraw.A1B2C1D2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase3) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 3,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_16_ROUND_FOUR,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (!event_id || !draw || !draw.champion) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw.champion) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          champion: Number(draw.champion),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // champion
            if (empDram.champion == adminDraw.champion) {
              totalDraw = (totalDraw +
                +drawSettingPoints.correctChampion) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 4,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_EMPLOYEE_8_TEAMS,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (
        !event_id ||
        !draw ||
        !draw.A1 ||
        !draw.A2 ||
        !draw.B1 ||
        !draw.B2 ||
        !draw.A1B2 ||
        !draw.B1A2 ||
        !draw.champion
      ) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (
        draw.A1 === draw.A2 ||
        draw.B1 === draw.B2 ||
        draw.A1B2 === draw.B1A2
      ) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      if (new Date() >= new Date("2023-02-09T10:00:00")) {
        return res.status(400).send({
          message: MSG.YOU_CANT_PREDICTED,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw) {
        return res.status(400).send({
          message: MSG.YOU_CANT_PREDICTED,
        });
      }

      await Draw.create({
        ...draw,
        employee_id: id,
        event_id,
      });

      return res.status(200).send({
        message: MSG.DRAW_CREATED,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_8_ROUND_ONE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;
      if (!event_id || !draw || !draw.A1 || !draw.A2 || !draw.B1 || !draw.B2) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (draw.A1 === draw.A2 || draw.B1 === draw.B2) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      const adminDraw = await Draw.create({
        A1: Number(draw.A1),
        A2: Number(draw.A2),
        B1: Number(draw.B1),
        B2: Number(draw.B2),
        employee_id: id,
        event_id,
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;
            // A1 et A2
            if (empDram.A1 == adminDraw.A1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.A1 == adminDraw.A2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.A2 == adminDraw.A2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.A2 == adminDraw.A1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }

            // B1 et B2
            if (empDram.B1 == adminDraw.B1) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.B1 == adminDraw.B2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            if (empDram.B2 == adminDraw.B2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase1) as any;
            }
            if (empDram.B2 == adminDraw.B1) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase1) as any;
            }
            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 1,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_8_ROUND_TWO,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (!event_id || !draw || !draw.A1B2 || !draw.B1A2) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      if (draw.A1B2 === draw.B1A2) {
        return res.status(400).send({
          message: MSG.VERIFY_DATA,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw.A1B2 && employeeDraw.B1A2) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          A1B2: Number(draw.A1B2),
          B1A2: Number(draw.B1A2),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // A1B2 et B1A2
            if (empDram.A1B2 == adminDraw.A1B2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.A1B2 == adminDraw.B1A2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }
            if (empDram.B1A2 == adminDraw.B1A2) {
              totalDraw = (totalDraw + +drawSettingPoints.correctPhase2) as any;
            }
            if (empDram.B1A2 == adminDraw.A1B2) {
              totalDraw = (totalDraw +
                +drawSettingPoints.incorrectPhase2) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 2,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_DRAW_BY_ADMIN_8_ROUND_THREE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { draw, event_id } = req.body;
      const { id } = res.locals.currentUser as User;

      if (!event_id || !draw || !draw.champion) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const employeeDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      if (employeeDraw.champion) {
        return res.status(400).send({
          message: MSG.YOU_CANT_UPDATE,
        });
      }

      await Draw.update(
        {
          champion: Number(draw.champion),
        },
        {
          where: {
            employee_id: id,
            event_id,
          },
        }
      );

      const adminDraw = await Draw.findOne({
        where: {
          employee_id: id,
          event_id,
        },
      });

      const employeesDraw = await Draw.findAll({
        where: {
          event_id,
        },
        include: [
          {
            model: User,
            where: { role: "employee" },
          },
        ],
      });

      const drawSettingPoints = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      const promise = new Promise<void>(async (resolve) => {
        if (employeesDraw.length > 0) {
          employeesDraw.forEach(async (empDram, index) => {
            let totalDraw = 0;

            // champion
            if (empDram.champion == adminDraw.champion) {
              totalDraw = (totalDraw +
                +drawSettingPoints.correctChampion) as any;
            }

            const totalPronostics = await TotalPronostics.findOne({
              where: {
                event_id,
                employee_id: empDram.employee_id,
              },
            });

            await DrawScore.create({
              point: totalDraw,
              phase: 3,
              event_id,
              employee_id: empDram.employee_id,
            });

            await TotalPronostics.update(
              {
                point: totalPronostics.point + totalDraw,
              },
              {
                where: {
                  event_id,
                  employee_id: empDram.employee_id,
                },
              }
            );

            if (employeesDraw.length === index + 1) resolve();
          });
        }
        if (employeesDraw.length === 0) {
          resolve();
        }
      });

      promise.then(() => {
        return res.status(200).send({
          message: MSG.DRAW_CREATED,
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_SETTING_DRAW_8_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_SETTING_DRAW_32_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_SETTING_DRAW_16_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_SETTING_DRAW_8_TEAMS_BY_EMPLOYEE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_SETTING_DRAW_32_TEAMS_BY_EMPLOYEE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.GET_SETTING_DRAW_16_TEAMS_BY_EMPLOYEE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;

      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const draw = await DrawSetting.findOne({
        where: {
          event_id,
        },
      });

      return res.status(200).send(draw);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.UPDATE_SETTING_DRAW_8_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const {
        correctPhase1,
        incorrectPhase1,
        correctPhase2,
        incorrectPhase2,
        correctChampion,
        event_id,
      } = req.body;
      if (
        !event_id ||
        !correctPhase1 ||
        !incorrectPhase1 ||
        !correctPhase2 ||
        !incorrectPhase2 ||
        !correctChampion
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(correctPhase1) < 0 ||
        parseInt(incorrectPhase1) < 0 ||
        parseInt(correctPhase2) < 0 ||
        parseInt(incorrectPhase2) < 0 ||
        parseInt(correctChampion) < 0 ||
        !Number.isInteger(parseFloat(correctPhase1)) ||
        !Number.isInteger(parseFloat(incorrectPhase1)) ||
        !Number.isInteger(parseFloat(correctPhase2)) ||
        !Number.isInteger(parseFloat(incorrectPhase2)) ||
        !Number.isInteger(parseFloat(correctChampion))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_POINTS });
      }

      await DrawSetting.update(
        {
          correctPhase1: parseInt(correctPhase1),
          incorrectPhase1: parseInt(incorrectPhase1),
          correctPhase2: parseInt(correctPhase2),
          incorrectPhase2: parseInt(incorrectPhase2),
          correctChampion: parseInt(correctChampion),

          event_id,
        },
        {
          where: { event_id },
        }
      );
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.UPDATE_SETTING_DRAW_32_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const {
        correctPhase1,
        incorrectPhase1,
        correctPhase2,
        incorrectPhase2,
        correctPhase3,
        incorrectPhase3,
        correctPhase4,
        incorrectPhase4,
        correctChampion,
        event_id,
      } = req.body;
      if (
        !event_id ||
        !correctPhase1 ||
        !incorrectPhase1 ||
        !correctPhase2 ||
        !incorrectPhase2 ||
        !correctPhase3 ||
        !incorrectPhase3 ||
        !correctPhase4 ||
        !incorrectPhase4 ||
        !correctChampion
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(correctPhase1) < 0 ||
        parseInt(incorrectPhase1) < 0 ||
        parseInt(correctPhase2) < 0 ||
        parseInt(incorrectPhase2) < 0 ||
        parseInt(correctPhase3) < 0 ||
        parseInt(incorrectPhase3) < 0 ||
        parseInt(correctPhase4) < 0 ||
        parseInt(incorrectPhase4) < 0 ||
        parseInt(correctChampion) < 0 ||
        !Number.isInteger(parseFloat(correctPhase1)) ||
        !Number.isInteger(parseFloat(incorrectPhase1)) ||
        !Number.isInteger(parseFloat(correctPhase2)) ||
        !Number.isInteger(parseFloat(incorrectPhase2)) ||
        !Number.isInteger(parseFloat(correctPhase3)) ||
        !Number.isInteger(parseFloat(incorrectPhase3)) ||
        !Number.isInteger(parseFloat(correctPhase4)) ||
        !Number.isInteger(parseFloat(incorrectPhase4)) ||
        !Number.isInteger(parseFloat(correctChampion))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_POINTS });
      }

      await DrawSetting.update(
        {
          correctPhase1: parseInt(correctPhase1),
          incorrectPhase1: parseInt(incorrectPhase1),
          correctPhase2: parseInt(correctPhase2),
          incorrectPhase2: parseInt(incorrectPhase2),
          correctPhase3: parseInt(correctPhase3),
          incorrectPhase3: parseInt(incorrectPhase3),
          correctPhase4: parseInt(correctPhase4),
          incorrectPhase4: parseInt(incorrectPhase4),
          correctChampion: parseInt(correctChampion),

          event_id,
        },
        {
          where: { event_id },
        }
      );
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.UPDATE_SETTING_DRAW_16_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const {
        correctPhase1,
        incorrectPhase1,
        correctPhase2,
        incorrectPhase2,
        correctPhase3,
        incorrectPhase3,
        correctChampion,
        event_id,
      } = req.body;
      if (
        !event_id ||
        !correctPhase1 ||
        !incorrectPhase1 ||
        !correctPhase2 ||
        !incorrectPhase2 ||
        !correctPhase3 ||
        !incorrectPhase3 ||
        !correctChampion
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(correctPhase1) < 0 ||
        parseInt(incorrectPhase1) < 0 ||
        parseInt(correctPhase2) < 0 ||
        parseInt(incorrectPhase2) < 0 ||
        parseInt(correctPhase3) < 0 ||
        parseInt(incorrectPhase3) < 0 ||
        parseInt(correctChampion) < 0 ||
        !Number.isInteger(parseFloat(correctPhase1)) ||
        !Number.isInteger(parseFloat(incorrectPhase1)) ||
        !Number.isInteger(parseFloat(correctPhase2)) ||
        !Number.isInteger(parseFloat(incorrectPhase2)) ||
        !Number.isInteger(parseFloat(correctPhase3)) ||
        !Number.isInteger(parseFloat(incorrectPhase3)) ||
        !Number.isInteger(parseFloat(correctChampion))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_POINTS });
      }

      await DrawSetting.update(
        {
          correctPhase1: parseInt(correctPhase1),
          incorrectPhase1: parseInt(incorrectPhase1),
          correctPhase2: parseInt(correctPhase2),
          incorrectPhase2: parseInt(incorrectPhase2),
          correctPhase3: parseInt(correctPhase3),
          incorrectPhase3: parseInt(incorrectPhase3),
          correctChampion: parseInt(correctChampion),

          event_id,
        },
        {
          where: { event_id },
        }
      );
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_SETTING_DRAW_16_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const {
        correctPhase1,
        incorrectPhase1,
        correctPhase2,
        incorrectPhase2,
        correctPhase3,
        incorrectPhase3,
        correctChampion,
        event_id,
      } = req.body;
      if (
        !event_id ||
        !correctPhase1 ||
        !incorrectPhase1 ||
        !correctPhase2 ||
        !incorrectPhase2 ||
        !correctPhase3 ||
        !incorrectPhase3 ||
        !correctChampion
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(correctPhase1) < 0 ||
        parseInt(incorrectPhase1) < 0 ||
        parseInt(correctPhase2) < 0 ||
        parseInt(incorrectPhase2) < 0 ||
        parseInt(correctPhase3) < 0 ||
        parseInt(incorrectPhase3) < 0 ||
        parseInt(correctChampion) < 0 ||
        !Number.isInteger(parseFloat(correctPhase1)) ||
        !Number.isInteger(parseFloat(incorrectPhase1)) ||
        !Number.isInteger(parseFloat(correctPhase2)) ||
        !Number.isInteger(parseFloat(incorrectPhase2)) ||
        !Number.isInteger(parseFloat(correctPhase3)) ||
        !Number.isInteger(parseFloat(incorrectPhase3)) ||
        !Number.isInteger(parseFloat(correctChampion))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_POINTS });
      }

      await DrawSetting.create({
        correctPhase1: parseInt(correctPhase1),
        incorrectPhase1: parseInt(incorrectPhase1),
        correctPhase2: parseInt(correctPhase2),
        incorrectPhase2: parseInt(incorrectPhase2),
        correctPhase3: parseInt(correctPhase3),
        incorrectPhase3: parseInt(incorrectPhase3),
        correctChampion: parseInt(correctChampion),

        event_id,
      });
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_SETTING_DRAW_8_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const {
        correctPhase1,
        incorrectPhase1,
        correctPhase2,
        incorrectPhase2,
        correctChampion,
        event_id,
      } = req.body;
      if (
        !event_id ||
        !correctPhase1 ||
        !incorrectPhase1 ||
        !correctPhase2 ||
        !incorrectPhase2 ||
        !correctChampion
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(correctPhase1) < 0 ||
        parseInt(incorrectPhase1) < 0 ||
        parseInt(correctPhase2) < 0 ||
        parseInt(incorrectPhase2) < 0 ||
        parseInt(correctChampion) < 0 ||
        !Number.isInteger(parseFloat(correctPhase1)) ||
        !Number.isInteger(parseFloat(incorrectPhase1)) ||
        !Number.isInteger(parseFloat(correctPhase2)) ||
        !Number.isInteger(parseFloat(incorrectPhase2)) ||
        !Number.isInteger(parseFloat(correctChampion))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_POINTS });
      }

      await DrawSetting.create({
        correctPhase1: parseInt(correctPhase1),
        incorrectPhase1: parseInt(incorrectPhase1),
        correctPhase2: parseInt(correctPhase2),
        incorrectPhase2: parseInt(incorrectPhase2),
        correctChampion: parseInt(correctChampion),

        event_id,
      });
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

DrawRoutes.post(
  URLs.CREATE_SETTING_DRAW_32_TEAMS_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const {
        correctPhase1,
        incorrectPhase1,
        correctPhase2,
        incorrectPhase2,
        correctPhase3,
        incorrectPhase3,
        correctPhase4,
        incorrectPhase4,
        correctChampion,
        event_id,
      } = req.body;
      if (
        !event_id ||
        !correctPhase1 ||
        !incorrectPhase1 ||
        !correctPhase2 ||
        !incorrectPhase2 ||
        !correctPhase3 ||
        !incorrectPhase3 ||
        !correctPhase4 ||
        !incorrectPhase4 ||
        !correctChampion
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(correctPhase1) < 0 ||
        parseInt(incorrectPhase1) < 0 ||
        parseInt(correctPhase2) < 0 ||
        parseInt(incorrectPhase2) < 0 ||
        parseInt(correctPhase3) < 0 ||
        parseInt(incorrectPhase3) < 0 ||
        parseInt(correctPhase4) < 0 ||
        parseInt(incorrectPhase4) < 0 ||
        parseInt(correctChampion) < 0 ||
        !Number.isInteger(parseFloat(correctPhase1)) ||
        !Number.isInteger(parseFloat(incorrectPhase1)) ||
        !Number.isInteger(parseFloat(correctPhase2)) ||
        !Number.isInteger(parseFloat(incorrectPhase2)) ||
        !Number.isInteger(parseFloat(correctPhase3)) ||
        !Number.isInteger(parseFloat(incorrectPhase3)) ||
        !Number.isInteger(parseFloat(correctPhase4)) ||
        !Number.isInteger(parseFloat(incorrectPhase4)) ||
        !Number.isInteger(parseFloat(correctChampion))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_POINTS });
      }

      await DrawSetting.create({
        correctPhase1: parseInt(correctPhase1),
        incorrectPhase1: parseInt(incorrectPhase1),
        correctPhase2: parseInt(correctPhase2),
        incorrectPhase2: parseInt(incorrectPhase2),
        correctPhase3: parseInt(correctPhase3),
        incorrectPhase3: parseInt(incorrectPhase3),
        correctPhase4: parseInt(correctPhase4),
        incorrectPhase4: parseInt(incorrectPhase4),
        correctChampion: parseInt(correctChampion),

        event_id,
      });
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { DrawRoutes };
