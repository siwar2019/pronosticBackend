import { DrawScore } from "./../sqlModels/drawScore";
import { Pronostics } from "./../sqlModels/pronostic";
import express from "express";
import { Company } from "../sqlModels/company";
import { MSG } from "../util/translate/fr/translateFR";
import * as bcrypt from "bcrypt";
import auth from "../middlewares/auth";
import { Request, Response } from "express";
import { User } from "../sqlModels/user";
import crypto from "crypto";
import mail from "../nodeMailer/mail";
import { welcomeEmployee } from "../nodeMailer/welcome";
import isPartner from "../middlewares/partner";
import { URLs } from "../util/common";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import { Events } from "../sqlModels/events";
import { TotalPronostics } from "../sqlModels/totalPronostics";
import { Op } from "sequelize";
import { Matchs } from "../sqlModels/Matchs";
import { Equipes } from "../sqlModels/equipe";
import { Groupes } from "../sqlModels/groupes";
import { PronosticsMatchs } from "../sqlModels/pronosticsMatchs";
import moment from "moment";
import { commercial } from "../sqlModels/commercial";
import { Options } from "../sqlModels/options";
import { historiqueSolde } from "../sqlModels/historiqueSolde";
import { settings } from "../sqlModels/settings";
import { Draw } from "../sqlModels/draw";

const EmployeeRoutes = express.Router();

/*            ******* Create Employee  ******      */

EmployeeRoutes.post(
  URLs.CREATE_EMPLOYEE,
  auth,
  isActive,
  isPartner,
  async (req, res) => {
    try {
      const { emails } = req.body;
      const user = res.locals.currentUser as User;

      if (emails.length === 0) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const company = await Company.findOne({ where: { id: user.company_id } });
      if (!company) {
        return res.status(401).send({ message: MSG.NOT_FOUND });
      }
      const employee = await User.findAll({
        where: { company_id: user.company_id, role: "employee" },
      });
      if (emails.length > Number(company.employee_number) - employee.length) {
        return res.status(400).send({
          message: MSG.MAXIMUM_NUMBER,
        });
      }

      const employees = await User.findAll({
        where: {
          email: { [Op.in]: [emails] },
        },
        attributes: ["email"],
      });

      if (employees.length > 0) {
        return res
          .status(401)
          .send({ employees, message: MSG.EMAIL_EXISTS_FOR_EMPLOYEE });
      }

      const events = await Events.findAll({
        include: [
          {
            model: User,
            where: { id: user.id },
          },
        ],
      });
      const promise = new Promise<void>((resolve) => {
        emails.forEach(async (email: string, index: number) => {
          const password = crypto.randomBytes(8).toString("hex");
          User.create({
            email: email,
            password: bcrypt.hashSync(password, 10),
            role: "employee",
            company_id: res.locals.currentUser.company_id,
            is_active: true,
          })
            .then(async (user) => {
              if (user) {
                mail(
                  user.email,
                  "Merci de nous avoir rejoint! ",
                  welcomeEmployee(email, password)
                );
              }
              events.forEach(async (event) => {
                await TotalPronostics.create({
                  point: 0,
                  diff: 0,
                  event_id: event.id,
                  employee_id: user.id,
                });
                await Options.create({
                  super_pronostic: false,
                  forgot_save: false,
                  double_score: false,
                  event_id: event.id,
                  employee_id: user.id,
                });
              });
              if (emails.length === index + 1) resolve();
            })
            .catch((error) => {
              res.status(500).send({ success: false, message: MSG.SQL_ERROR });
            });
        });
      });

      promise.then(async () => {
        if (user.commercial_user) {
          const commercialUser = await User.findOne({
            where: { id: user.commercial_user },
          });
          const soldeCommercial = await commercial.findOne({
            where: { id: commercialUser.commercial_id },
          });
          const prixusers = await settings.findOne({});

          await soldeCommercial.update(
            {
              solde:
                Number(soldeCommercial.solde) +
                (Number(soldeCommercial.commissionRate) / 100) *
                  emails.length *
                  Number(prixusers.prixUsers),
            },
            {
              where: { id: soldeCommercial.id },
            }
          );

          await historiqueSolde.create({
            solde:
              (Number(soldeCommercial.commissionRate) / 100) *
              emails.length *
              Number(prixusers.prixUsers),
            commercial_user: user.commercial_user,
            commissionRate: soldeCommercial.commissionRate,
            employee_number: emails.length,
            priceUser: prixusers.prixUsers,
            company_id: user.company_id,
          });
        }

        return res.status(200).send({
          message: MSG.USER_CREATED,
        });
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get Employees of Partner  ******      */

EmployeeRoutes.get(
  URLs.GET_EMPLOYEE_PARTNER,
  auth,
  isPartner,
  isActive,
  async (req, res) => {
    const { company_id } = res.locals.currentUser as User;
    if (!company_id)
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    try {
      const employees: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: { company_id, role: "employee" },
      });
      if (employees) {
        return res.status(200).send({ data: employees });
      }
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Edit Employee ******      */

EmployeeRoutes.put(
  URLs.UPDATE_EMPLOYEE,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    let partner = res.locals.currentUser as User;
    const id = req.body.id;
    const email = req.body.email;

    if (!id || !email) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      const user: User | null = await User.findOne({
        where: {
          id: id,
          is_active: true,
          company_id: partner.id,
          role: "employee",
        },
      });
      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }
      User.update(
        {
          email: email,
        },
        {
          where: {
            id: user.id,
          },
        }
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return res.status(400).send({ message: MSG.UPDATED_ERROR });
          } else {
            return res.status(200).send({
              message: MSG.UPDATED_SUCCESUFULLY,
            });
          }
        })
        .catch((error) => {
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
/*            ****** Reset PassWord Employee ******      */

EmployeeRoutes.put(
  URLs.UPDATE_EMPLOYEE_PASSWORD,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    let partner = res.locals.currentUser as User;
    const id = req.body.id;

    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      const user: User | null = await User.findOne({
        where: {
          id: id,
          is_active: true,
          company_id: partner.id,
          role: "employee",
        },
      });
      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }
      const password = crypto.randomBytes(8).toString("hex");
      User.update(
        {
          password: bcrypt.hashSync(password, 10),
        },
        {
          where: {
            id: user.id,
          },
        }
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return res.status(400).send({ message: MSG.UPDATED_ERROR });
          } else {
            mail(
              user.email,
              "Change PassWord ",
              welcomeEmployee(user.email, password)
            );

            return res.status(200).send({
              message: MSG.UPDATED_SUCCESUFULLY,
            });
          }
        })
        .catch((error) => {
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Delete Employee  ******      */

EmployeeRoutes.post(
  URLs.DELETE_EMPLOYEE,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    const id = req.body.id;
    let { company_id } = res.locals.currentUser as User;
    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      const user: User | null = await User.findOne({
        where: { id: id, role: "employee", company_id: company_id },
      });
      console.log(user);
      if (!user) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      } else {
        Pronostics.destroy({ where: { employee_id: user.id } });
        PronosticsMatchs.destroy({ where: { employee_id: user.id } });
        TotalPronostics.destroy({ where: { employee_id: user.id } });
        Options.destroy({ where: { employee_id: user.id } });
        DrawScore.destroy({ where: { employee_id: user.id } });
        Draw.destroy({ where: { employee_id: user.id } });
        User.destroy({ where: { id: user.id } })
          .then((deleted) => {
            return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
          })
          .catch((error) => {
            console.log("error", error);
            res.status(500).send({ message: MSG.SQL_ERROR });
          });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get List Employes  ******      */

EmployeeRoutes.get(
  URLs.GET_EMPLOYEES,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const listEmployee: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: { role: "employee" },
      });
      return res.status(200).send({ data: listEmployee });
    } catch (err) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Activate Account Emplyee ******      */

EmployeeRoutes.post(
  URLs.ACTIVATE_ACCOUNT_EMPLOYEE,
  auth,
  isPartner,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { id, is_active } = req.body;
      if (!id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      User.findOne({
        where: { id: id, role: "employee", company_id: company_id },
      })
        .then(async (user) => {
          if (!user) {
            return res.status(401).send({ message: MSG.NOT_FOUND });
          } else {
            User.update(
              { is_active: is_active },
              {
                where: {
                  id: id,
                },
              }
            )
              .then((updatedUser) => {
                if (!updatedUser) {
                  return res.status(400).send({ message: MSG.UPDATED_ERROR });
                } else {
                  return res.status(200).send({
                    message: MSG.UPDATED_SUCCESUFULLY,
                  });
                }
              })
              .catch((error) => {
                res
                  .status(500)
                  .send({ success: false, message: MSG.SQL_ERROR });
              });
          }
        })
        .catch((error) => {
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Daily points for partner statics ******      */

EmployeeRoutes.post(
  URLs.STATISTICS_EMPLOYEE_DAILY_POINTS,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    try {
      const { event_id, employee_id } = req.body;

      if (!event_id || !employee_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const groups = await Groupes.findAll({
        where: { event_id },
      });
      const grIds = groups.map((gr) => gr.id);
      const listMatch = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
      });

      const listMatchIds = listMatch.map((matchId) => matchId.id);
      let listPoints = await PronosticsMatchs.findAll({
        where: {
          employee_id,
          match_id: { [Op.in]: listMatchIds },
        },
        order: [["createdAt", "ASC"]],
      });

      let finalListPoints = listPoints.map((object) => {
        return {
          createdAt: moment(object.createdAt).format("MM/DD/YYYY"),
          point: object.point,
        };
      });

      let dates = [];

      finalListPoints.map(function (matchPoints) {
        if (dates.indexOf(matchPoints.createdAt) === -1)
          dates = dates.concat(matchPoints.createdAt);
      });

      let points = 0;
      let finalTable = [];
      dates.map(function (date) {
        finalListPoints.map(function (matchPoints) {
          if (date === matchPoints.createdAt) {
            points = points + matchPoints.point;
          }
        });
        finalTable = finalTable.concat({
          date: date,
          points: points,
        });

        points = 0;
      });

      return res.status(200).send(finalTable);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Daily rang for partner statics ******      */
EmployeeRoutes.post(
  URLs.STATISTICS_EMPLOYEE_DAILY_RANG,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    try {
      const { event_id, employee_id } = req.body;

      if (!event_id || !employee_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const groups = await Groupes.findAll({
        where: { event_id },
      });
      const grIds = groups.map((gr) => gr.id);
      const listMatch = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
      });

      const listMatchIds = listMatch.map((matchId) => matchId.id);
      let listPoints = await PronosticsMatchs.findAll({
        where: {
          match_id: { [Op.in]: listMatchIds },
        },
        order: [["createdAt", "ASC"]],
      });

      let finalListPoints = listPoints.map((object) => {
        return {
          createdAt: moment(object.createdAt).format("MM/DD/YYYY"),
          point: object.point,
          employee: object.employee_id,
        };
      });

      let dates = [];
      let employees = [];
      finalListPoints.map(function (matchPoints) {
        if (dates.indexOf(matchPoints.createdAt) === -1)
          dates = dates.concat(matchPoints.createdAt);
      });

      finalListPoints.map(function (matchPoints) {
        if (employees.indexOf(matchPoints.employee) === -1)
          employees = employees.concat(matchPoints.employee);
      });

      let points = 0;
      let finalTable = [];
      dates.map(function (date) {
        employees.map(function (employe) {
          finalListPoints.map(function (matchPoints) {
            if (
              date === matchPoints.createdAt &&
              employe === matchPoints.employee
            ) {
              points = points + matchPoints.point;
            }
          });
          finalTable = finalTable.concat({
            employee: employe,
            date: date,
            points: points,
          });

          points = 0;
        });
      });

      let datas = [];
      let rangTable = [];
      finalTable.forEach((el) => {
        if (datas.find((res) => res.date === el.date)) {
          rangTable.push({
            employee_id: el.employee,
            points: el.points,
          });
          rangTable.sort((a, b) => b.points - a.points);

          const upd_obj = datas.findIndex((res) => res.date === el.date);
          datas[upd_obj].rangTable = rangTable;
        } else {
          rangTable = [];
          rangTable.push({
            employee_id: el.employee,
            points: el.points,
          });
          datas.push({
            date: el.date,
            rangTable,
          });
        }
      });
      let rangs = [];
      datas.map((data) =>
        data.rangTable.map((el: { employee_id: any }, index: number) => {
          if (el.employee_id == employee_id) {
            rangs.push({
              date: data.date,
              rang: index + 1,
            });
          }
        })
      );

      return res.status(200).send(rangs);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Daily difference points for partner statics ******      */

EmployeeRoutes.post(
  URLs.STATISTICS_EMPLOYEE_DAILY_POINTS_DIFFERENCE,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    try {
      const { event_id, employee_id } = req.body;

      if (!event_id || !employee_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const groups = await Groupes.findAll({
        where: { event_id },
      });
      const grIds = groups.map((gr) => gr.id);
      const listMatch = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
      });

      const listMatchIds = listMatch.map((matchId) => matchId.id);
      let listPoints = await PronosticsMatchs.findAll({
        where: {
          match_id: { [Op.in]: listMatchIds },
        },
        order: [["createdAt", "ASC"]],
      });

      let finalListPoints = listPoints.map((object) => {
        return {
          createdAt: moment(object.createdAt).format("MM/DD/YYYY"),
          point: object.point,
          employee: object.employee_id,
        };
      });

      let dates = [];
      let employees = [];
      finalListPoints.map(function (matchPoints) {
        if (dates.indexOf(matchPoints.createdAt) === -1)
          dates = dates.concat(matchPoints.createdAt);
      });

      finalListPoints.map(function (matchPoints) {
        if (employees.indexOf(matchPoints.employee) === -1)
          employees = employees.concat(matchPoints.employee);
      });

      let points = 0;
      let finalTable = [];
      dates.map(function (date) {
        employees.map(function (employe) {
          finalListPoints.map(function (matchPoints) {
            if (
              date === matchPoints.createdAt &&
              employe === matchPoints.employee
            ) {
              points = points + matchPoints.point;
            }
          });
          finalTable = finalTable.concat({
            employee: employe,
            date: date,
            points: points,
          });

          points = 0;
        });
      });

      let datas = [];
      let rangTable = [];
      finalTable.forEach((el) => {
        if (datas.find((res) => res.date === el.date)) {
          rangTable.push({
            employee_id: el.employee,
            points: el.points,
          });
          rangTable.sort((a, b) => b.points - a.points);

          const upd_obj = datas.findIndex((res) => res.date === el.date);
          datas[upd_obj].rangTable = rangTable;
        } else {
          rangTable = [];
          rangTable.push({
            employee_id: el.employee,
            points: el.points,
          });
          datas.push({
            date: el.date,
            rangTable,
          });
        }
      });
      let rangs = [];
      datas.map((data) =>
        data.rangTable.map(
          (el: { employee_id: any; points: number }, index: number) => {
            if (el.employee_id == employee_id) {
              rangs.push({
                date: data.date,
                difference: data.rangTable[0].points - el.points,
              });
            }
          }
        )
      );

      return res.status(200).send(rangs);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Points details per employee for partner statics ******      */
EmployeeRoutes.post(
  URLs.STATISTICS_EMPLOYEE_POINTS_DETAILS,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    try {
      const { event_id, employee_id } = req.body;

      if (!event_id || !employee_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const groups = await Groupes.findAll({
        where: { event_id },
      });
      const grIds = groups.map((gr) => gr.id);
      const listMatch = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
      });

      const listMatchIds = listMatch.map((matchId) => matchId.id);
      let listPoints = await PronosticsMatchs.findAll({
        where: {
          employee_id,
          match_id: { [Op.in]: listMatchIds },
        },
        attributes: {
          exclude: ["id", "diff", "createdAt", "updatedAt", "employee_id"],
        },
      });

      let matchsCoff = await Matchs.findAll({
        attributes: {
          exclude: [
            "date",
            "time",
            "updatedAt",
            "employee_id",
            "groupe_id",
            "createdAt",
          ],
        },
      });

      let pointsWithoutCoff = [];
      matchsCoff.map(function (matchcoefs) {
        listPoints.map(function (listPoints: {
          match_id: number;
          point: number;
        }) {
          if (matchcoefs.id === listPoints.match_id)
            pointsWithoutCoff.push({
              matchId: matchcoefs.id,
              points: listPoints.point / matchcoefs.coeff,
            });
        });
      });

      let IC = 0;
      let C = 0;
      let DWC = 0;
      let WC = 0;

      pointsWithoutCoff.map((point) => {
        switch (point.points) {
          case 1:
            WC = WC + 1;
            break;
          case 2:
            DWC = DWC + 1;
            break;
          case 3:
            C = C + 1;
            break;
          default:
            IC = IC + 1;
        }
      });

      let pointsDetails = [C, DWC, WC, IC];

      return res.status(200).send(pointsDetails);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { EmployeeRoutes };
