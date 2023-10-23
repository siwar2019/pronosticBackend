import { UserEvents } from "./../sqlModels/userEvents";
import express from "express";
import { URLs } from "../util/common";
import isActive from "../middlewares/active";
import isParnter from "../middlewares/partner";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { MSG } from "../util/translate/fr/translateFR";
import { Matchs } from "../sqlModels/Matchs";
import { Pronostics } from "../sqlModels/pronostic";
import isEmployee from "../middlewares/employee";
import { User } from "../sqlModels/user";
import { Equipes } from "../sqlModels/equipe";
import { Groupes } from "../sqlModels/groupes";
import { Score } from "../sqlModels/score";
import { PronosticsMatchs } from "../sqlModels/pronosticsMatchs";
import { TotalPronostics } from "../sqlModels/totalPronostics";
import { Events } from "../sqlModels/events";
import { Company } from "../sqlModels/company";
import { where } from "sequelize/types";
import { Op } from "sequelize";
import isPartner from "../middlewares/partner";
import { IPoints } from "../type/points";
import { historicScore } from "../sqlModels/historicScore";
import { sequelize } from "../sequelize";
import { pronosticsHistory } from "../sqlModels/pronosticHistory";
import { Options } from "../sqlModels/options";
import moment from "moment";
import { eleminateHours } from "../util/hours";
import mail from "../nodeMailer/mail";
import { DailyReport, WarningInPronostics } from "../nodeMailer/welcome";
import tz from "moment-timezone";
const PronosticsRoutes = express.Router();

PronosticsRoutes.post(
  URLs.CREATE_PRONOSTIC,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id } = req.body;
      if (!match_id || !equipe1 || !equipe2) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(equipe1) < 0 ||
        parseInt(equipe2) < 0 ||
        !Number.isInteger(parseFloat(equipe1)) ||
        !Number.isInteger(parseFloat(equipe2))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_SCORE });
      }

      const match = await Matchs.findOne({ where: { id: match_id } });
      if (!match) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_NOTFIND });
      }
      // const matchDate = new Date(Number(match.date) - 15 * 60000);
      const matchDate = new Date(match.date);
      matchDate.setHours(matchDate.getHours() - 1);

      if (new Date() >= matchDate || !match.date) {
        return res
          .status(400)
          .send({ success: false, message: MSG.YOU_CANT_PREDICTED });
      }
      const pronostic = await Pronostics.findOne({
        where: { match_id, employee_id: id },
      });
      if (pronostic) {
        return res.status(400).send({
          message: MSG.YOU_PREDICTED,
        });
      }
      await Pronostics.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
      });
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "create",
      });
      return res.status(200).send({
        message: MSG.CREATE_SUCCESUFULLY,
      });
    } catch (err) {
      console.log(err, "err");
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.UPDATE_PRONOSTIC,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id } = req.body;
      if (!match_id || !equipe1 || !equipe2) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(equipe1) < 0 ||
        parseInt(equipe2) < 0 ||
        !Number.isInteger(parseFloat(equipe1)) ||
        !Number.isInteger(parseFloat(equipe2))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_SCORE });
      }

      const match = await Matchs.findOne({ where: { id: match_id } });
      if (!match) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_NOTFIND });
      }
      // const matchDate = new Date(Number(match.date) - 15 * 60000);
      const matchDate = new Date(match.date);
      matchDate.setHours(matchDate.getHours() - 1);

      if (new Date() >= matchDate || !match.date) {
        return res
          .status(400)
          .send({ success: false, message: MSG.YOU_CANT_PREDICTED });
      }
      const EmployeeOptions = await Options.findOne({
        where: { employee_id: id, double_match_id: match_id },
        attributes: ["double_score"],
      });
      console.log(match_id, id, EmployeeOptions);
      await Pronostics.update(
        {
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
          match_id,
        },
        {
          where: { match_id, employee_id: id },
        }
      );
      if (EmployeeOptions?.double_score)
        await pronosticsHistory.create({
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
          match_id,
          employee_id: id,
          status: "update",
          options: "double_score",
        });
      else if (
        !EmployeeOptions?.double_score ||
        EmployeeOptions?.double_score === null
      )
        await pronosticsHistory.create({
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
          match_id,
          employee_id: id,
          status: "update",
        });
      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      console.log(err, "err");
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_PRONOSTIC_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { match_id } = req.body;
      if (!match_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const pronostic = await Pronostics.findOne({
        where: { match_id, employee_id: id },
        include: [
          {
            model: Matchs,
            include: [
              {
                model: Equipes,
                include: [
                  {
                    model: Groupes,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!pronostic) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }

      return res.status(200).send(pronostic);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_PRONOSTICS_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const groupesEvent = await Groupes.findAll({
        where: { event_id },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Matchs,
              },
            ],
          },
        ],
      });

      const grIds = groupesEvent.map((gr) => gr.id);
      const matches = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Groupes,
              },
            ],
          },
        ],
      });
      const matchIds = matches.map((match) => match.id);
      const pronostics = await Pronostics.findAll({
        where: { employee_id: id, match_id: { [Op.in]: matchIds } },
        include: [
          {
            model: Matchs,
            include: [
              {
                model: Equipes,
                include: [
                  {
                    model: Groupes,
                  },
                ],
              },
              {
                model: Score,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const pronosticsMatchs = await PronosticsMatchs.findAll({
        where: {
          employee_id: id,
        },
      });
      let result = [];
      pronostics.map((pronostic) => {
        const pronosticMatch = pronosticsMatchs.find(
          (x) => x.match_id === pronostic.match_id
        );
        if (pronostic.matchs.score && pronosticMatch) {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: pronosticMatch,
              score: pronostic.matchs.score,
            },
          });
        } else {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: {},
              score: {},
            },
          });
        }
      });

      // result = result.filter(
      //   (pronostic) =>
      //     pronostic.matchs.equipes[0].groupes[0].event_id == event_id
      // );

      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_PRONOSTICS_EMPLOYEE_FOR_PARTNER,
  auth,
  isActive,
  isParnter,
  async function (req, res) {
    try {
      const { event_id, id } = req.body;
      if (!event_id || !id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const pronostics = await Pronostics.findAll({
        where: { employee_id: id },
        include: [
          {
            model: Matchs,
            include: [
              {
                model: Equipes,
                include: [
                  {
                    model: Groupes,
                  },
                ],
              },
              {
                model: Score,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const pronosticsMatchs = await PronosticsMatchs.findAll({
        where: {
          employee_id: id,
        },
      });
      let result = [];
      pronostics.map((pronostic) => {
        const pronosticMatch = pronosticsMatchs.find(
          (x) => x.match_id === pronostic.match_id
        );
        if (pronostic.matchs.score && pronosticMatch) {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: pronosticMatch,
              score: pronostic.matchs.score,
            },
          });
        } else {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: {},
              score: {},
            },
          });
        }
      });

      result = result.filter(
        (pronostic) =>
          pronostic.matchs.equipes[0].groupes[0].event_id == event_id
      );

      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_PRONOSTICS_EMPLOYEES_FOR_PARTNER,
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

      const users = await User.findAll({
        where: {
          company_id,
          role: "employee",
        },
      });

      let result = [];
      users.map(async (user, index) => {
        Pronostics.findAll({
          where: { employee_id: user.id },
          limit: 6,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Matchs,
              include: [
                {
                  model: Equipes,
                },
                {
                  model: Groupes,
                },
                {
                  model: Score,
                },
              ],
            },
          ],
        }).then((pronostics) => {
          PronosticsMatchs.findAll({
            where: {
              employee_id: user.id,
            },
          }).then((pronosticsMatchs) => {
            pronostics.map((pronostic) => {
              const pronosticMatch = pronosticsMatchs.find(
                (x) => x.match_id === pronostic.match_id
              );
              if (pronostic.matchs.score && pronosticMatch) {
                result.push({
                  id: pronostic.id,
                  equipe1: pronostic.equipe1,
                  equipe2: pronostic.equipe2,
                  match_id: pronostic.match_id,
                  employee_id: pronostic.employee_id,
                  createdAt: pronostic.createdAt,
                  updatedAt: pronostic.updatedAt,
                  matchs: {
                    id: pronostic.matchs.id,
                    date: pronostic.matchs.date,
                    time: pronostic.matchs.time,
                    groupe_id: pronostic.matchs.groupe_id,
                    coeff: pronostic.matchs.coeff,
                    createdAt: pronostic.matchs.createdAt,
                    updatedAt: pronostic.matchs.updatedAt,
                    equipes: pronostic.matchs.equipes,
                    groupes: pronostic.matchs.groupes,
                    pronosticsMatchs: pronosticMatch,
                    score: pronostic.matchs.score,
                  },
                });
              }
              // else {
              //   result.push({
              //     id: pronostic.id,
              //     equipe1: pronostic.equipe1,
              //     equipe2: pronostic.equipe2,
              //     match_id: pronostic.match_id,
              //     employee_id: pronostic.employee_id,
              //     createdAt: pronostic.createdAt,
              //     updatedAt: pronostic.updatedAt,
              //     matchs: {
              //       id: pronostic.matchs.id,
              //       date: pronostic.matchs.date,
              //       time: pronostic.matchs.time,
              //       groupe_id: pronostic.matchs.groupe_id,
              //       coeff: pronostic.matchs.coeff,
              //       createdAt: pronostic.matchs.createdAt,
              //       updatedAt: pronostic.matchs.updatedAt,
              //       equipes: pronostic.matchs.equipes,
              //       pronosticsMatchs: {},
              //       score: {},
              //     },
              //   });
              // }
            });
            result = result.filter(
              (pronostic) => pronostic.matchs.groupes.event_id == event_id
            );

            if (users.length === index + 1) {
              return res.status(200).send(result);
            }
          });
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_TOTAL_PRONOSTICS_EMPLOYEE_BY_EVENT,
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

      const data = await TotalPronostics.findAll({
        where: { event_id },
        order: [
          ["point", "DESC"],
          ["diff", "DESC"],
        ],
        include: [
          {
            model: User,
            where: { company_id, is_active: true },
          },
        ],
      });

      return res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
PronosticsRoutes.post(
  URLs.GET_TOTAL_PRONOSTICS_EMPLOYEE_BY_EVENT_FOR_PARTNER_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { partner_id, event_id } = req.body;

      if (!partner_id || !event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const partner = await User.findOne({
        where: { id: partner_id },
      });

      const data = await TotalPronostics.findAll({
        where: { event_id },
        order: [
          ["point", "DESC"],
          ["diff", "DESC"],
        ],
        include: [
          {
            model: User,
            where: { company_id: partner.company_id, is_active: true },
          },
        ],
      });

      return res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_PRONOSTICS_EMPLOYEES_FOR_PARTNER_FOR_PARTNER_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { partner_id, event_id } = req.body;

      if (!partner_id || !event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const partner = await User.findOne({
        where: { id: partner_id },
      });

      const users = await User.findAll({
        where: {
          company_id: partner.company_id,
          role: "employee",
        },
      });

      let result = [];
      users.map(async (user, index) => {
        Pronostics.findAll({
          where: { employee_id: user.id },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Matchs,
              include: [
                {
                  model: Equipes,
                  include: [
                    {
                      model: Groupes,
                    },
                  ],
                },
                {
                  model: Score,
                },
              ],
            },
          ],
        }).then((pronostics) => {
          PronosticsMatchs.findAll({
            where: {
              employee_id: user.id,
            },
          }).then((pronosticsMatchs) => {
            pronostics.map((pronostic) => {
              const pronosticMatch = pronosticsMatchs.find(
                (x) => x.match_id === pronostic.match_id
              );
              if (pronostic.matchs.score && pronosticMatch) {
                result.push({
                  id: pronostic.id,
                  equipe1: pronostic.equipe1,
                  equipe2: pronostic.equipe2,
                  match_id: pronostic.match_id,
                  employee_id: pronostic.employee_id,
                  createdAt: pronostic.createdAt,
                  updatedAt: pronostic.updatedAt,
                  matchs: {
                    id: pronostic.matchs.id,
                    date: pronostic.matchs.date,
                    time: pronostic.matchs.time,
                    groupe_id: pronostic.matchs.groupe_id,
                    coeff: pronostic.matchs.coeff,
                    createdAt: pronostic.matchs.createdAt,
                    updatedAt: pronostic.matchs.updatedAt,
                    equipes: pronostic.matchs.equipes,
                    pronosticsMatchs: pronosticMatch,
                    score: pronostic.matchs.score,
                  },
                });
              } else {
                result.push({
                  id: pronostic.id,
                  equipe1: pronostic.equipe1,
                  equipe2: pronostic.equipe2,
                  match_id: pronostic.match_id,
                  employee_id: pronostic.employee_id,
                  createdAt: pronostic.createdAt,
                  updatedAt: pronostic.updatedAt,
                  matchs: {
                    id: pronostic.matchs.id,
                    date: pronostic.matchs.date,
                    time: pronostic.matchs.time,
                    groupe_id: pronostic.matchs.groupe_id,
                    coeff: pronostic.matchs.coeff,
                    createdAt: pronostic.matchs.createdAt,
                    updatedAt: pronostic.matchs.updatedAt,
                    equipes: pronostic.matchs.equipes,
                    pronosticsMatchs: {},
                    score: {},
                  },
                });
              }
            });
            result = result.filter(
              (pronostic) =>
                pronostic.matchs.equipes[0].groupes[0].event_id == event_id
            );

            if (users.length === index + 1) {
              return res.status(200).send(result);
            }
          });
        });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_POINTS_PRONOSTICS_EMPLOYEE_BY_EVENT,
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

      const groupes = await Groupes.findAll({
        where: { event_id },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Matchs,
              },
            ],
          },
        ],
      });

      const grIds = groupes.map((gr) => gr.id);
      const listMatch = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Groupes,
                where: { event_id },
              },
            ],
          },
        ],
      });
      const matchsIds = listMatch.map((el) => el.id);

      const employees = await User.findAll({
        where: {
          company_id,
          role: "employee",
          is_active: true,
        },
        attributes: { exclude: ["password"] },
      });

      let formatData = [];
      const promise = new Promise<void>((resolve) => {
        employees.forEach(async (emp, index) => {
          const data = await PronosticsMatchs.findAll({
            where: {
              match_id: { [Op.in]: matchsIds },
              employee_id: emp.id,
            },
          });

          const sum = data.reduce((accumulator, object) => {
            return accumulator + object.point;
          }, 0);
          formatData.push({
            emp: emp,
            pointsPronostics: sum,
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

PronosticsRoutes.post(
  URLs.GET_PRONOSTICS_EMPLOYEE_FOR_PARTNER_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id, employee_id } = req.body;
      if (!event_id || !employee_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const pronostics = await Pronostics.findAll({
        where: { employee_id },
        include: [
          {
            model: Matchs,
            include: [
              {
                model: Equipes,
                include: [
                  {
                    model: Groupes,
                  },
                ],
              },
              {
                model: Score,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const pronosticsMatchs = await PronosticsMatchs.findAll({
        where: {
          employee_id,
        },
      });
      let result = [];
      pronostics.map((pronostic) => {
        const pronosticMatch = pronosticsMatchs.find(
          (x) => x.match_id === pronostic.match_id
        );
        if (pronostic.matchs.score && pronosticMatch) {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: pronosticMatch,
              score: pronostic.matchs.score,
            },
          });
        } else {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: {},
              score: {},
            },
          });
        }
      });

      result = result.filter(
        (pronostic) =>
          pronostic.matchs.equipes[0].groupes[0].event_id == event_id
      );

      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_TOTAL_PRONOSTICS_ADMIN_BY_PARTNER_BY_EVENTS,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const event = await Events.findOne({
        where: { id: event_id },
        include: [
          {
            model: User,
            include: [
              {
                model: Company,
              },
            ],
          },
        ],
      });

      let data = [];
      const promise = new Promise<void>((resolve) => {
        event.user.forEach(async (el, index) => {
          const totalPronosticsByEvent = await TotalPronostics.findAll({
            where: { event_id: event_id },
            include: [
              {
                model: User,
                where: { company_id: el.company_id },
                include: [
                  {
                    model: Company,
                  },
                ],
              },
            ],
            order: [
              ["point", "DESC"],
              ["diff", "DESC"],
            ],
          });

          if (totalPronosticsByEvent.length > 0) {
            data.push(totalPronosticsByEvent[0]);
          }

          if (event.user.length === index + 1) resolve();
        });
      });

      promise.then(() => {
        return res.status(200).send(data);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

///// get total pronostic by match for admin /////

PronosticsRoutes.post(
  URLs.GET_TOTALE_PRONOSTICS_BY_MATCH_FOR_ADMIN,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { match_id, event_id, company_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const scoreMatch = await Score.findOne({
        where: {
          id: match_id,
        },
      });
      let pronostics;
      if (company_id) {
        pronostics = await Pronostics.findAll({
          where: { match_id },
          include: [
            {
              model: User,
              where: { company_id },
              attributes: {
                exclude: [
                  "password",
                  "password_token",
                  "createdAt",
                  "updatedAt",
                ],
              },
            },
          ],
        });
      } else {
        pronostics = await Pronostics.findAll({
          where: { match_id },

          include: [
            {
              model: User,
              attributes: {
                exclude: [
                  "password",
                  "password_token",
                  "createdAt",
                  "updatedAt",
                ],
              },
            },
          ],
        });
      }

      let data = [];
      let users = [];
      pronostics.forEach((el) => {
        if (
          data.find(
            (res) => res.equipe1 === el.equipe1 && res.equipe2 === el.equipe2
          )
        ) {
          users.push(el.users);
          const upd_obj = data.findIndex(
            (res) => res.equipe1 === el.equipe1 && res.equipe2 === el.equipe2
          );
          data[upd_obj].users = users;
        } else {
          users = [];
          users.push({
            id: el.users.id,
            email: el.users.email,
            role: el.users.role,
            is_active: el.users.is_active,
            company_id: el.users.company_id,
          });
          data.push({
            id: el.id,
            equipe1: el.equipe1,
            equipe2: el.equipe2,
            match_id: el.match_id,
            users,
          });
        }
      });

      return res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_POINTS_PRONOSTICS_EMPLOYEE_BY_EVENT_ADMIN,
  auth,
  isActive,
  isAdmin,
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

      const listMatch = await Matchs.findAll({
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Groupes,
                where: { event_id },
              },
            ],
          },
        ],
      });
      const matchsIds = listMatch.map((el) => el.id);

      const employees = await User.findAll({
        where: {
          company_id: partner.company_id,
          role: "employee",
        },
        attributes: { exclude: ["password"] },
      });

      let formatData = [];
      const promise = new Promise<void>((resolve) => {
        employees.forEach(async (emp, index) => {
          const data = await PronosticsMatchs.findAll({
            where: {
              match_id: { [Op.in]: matchsIds },
              employee_id: emp.id,
            },
          });

          const sum = data.reduce((accumulator, object) => {
            return accumulator + object.point;
          }, 0);
          formatData.push({
            emp: emp,
            pointsPronostics: sum,
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

PronosticsRoutes.get(
  URLs.GET_TOTAL_PRONOSTICS_EMPLOYEE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id, id } = res.locals.currentUser as User;

      const totalPronostics: TotalPronostics[] = await TotalPronostics.findAll({
        include: [Events],
      });

      const actives = await UserEvents.findAll({
        where: {
          user_id: id,
        },
        attributes: ["event_id", "is_calculated"],
      });

      const activeEvents = [];
      actives.map(function (activeEvent) {
        if (activeEvent.is_calculated) {
          activeEvents.push(activeEvent);
        }
      });

      const employees = await User.findAll({
        where: {
          company_id,
          role: "employee",
        },
        attributes: { exclude: ["password"] },
      });

      const event_ids = activeEvents.map((el) => el.event_id);

      let formatData = [];
      const promise = new Promise<void>((resolve) => {
        employees.forEach(async (emp, index) => {
          const data = await TotalPronostics.findAll({
            where: {
              employee_id: emp.id,
              event_id: event_ids,
            },
          });
          const sum = data.reduce((accumulator, object) => {
            return accumulator + object.point;
          }, 0);

          const sum2 = data.reduce((accumulator, object) => {
            return accumulator + object.diff;
          }, 0);
          formatData.push({
            emp: emp,
            pointsPronostics: sum,
            difference: sum2,
          });

          if (employees.length === index + 1) resolve();
        });
      });

      promise.then(() => {
        formatData.sort(
          (x, y) =>
            x.pointsPronostics - y.pointsPronostics &&
            x.difference - y.difference
        );
        return res.status(200).send(formatData);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.get(
  URLs.GET_EACH_EVENT_PRONOSTICS_EMPLOYEE_FOR_PARTNER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id, id } = res.locals.currentUser as User;

      const totalPronostics: TotalPronostics[] = await TotalPronostics.findAll({
        include: [Events],
      });

      const actives = await UserEvents.findAll({
        where: {
          user_id: id,
          is_calculated: true,
          is_active: true,
        },
        attributes: ["event_id", "is_calculated"],
      });

      const showed = await UserEvents.findAll({
        where: {
          user_id: id,
          is_calculated: true,
          is_active: true,
          is_hidden: true,
        },
        attributes: ["event_id", "is_calculated", "is_hidden"],
      });

      const event_ids = actives.map((activeEvent) => activeEvent.event_id);

      const eventShowed_ids = showed.map((activeEvent) => activeEvent.event_id);

      const employees = await User.findAll({
        where: {
          company_id,
          role: "employee",
          is_active: true,
        },
        attributes: { exclude: ["password"] },
      });

      const events = await Events.findAll({
        where: {
          id: event_ids,
        },
      });

      const eventsShowed = await Events.findAll({
        where: {
          id: eventShowed_ids,
        },
      });

      let formatData = [];
      let pointsPronostics = 0;
      let difference = 0;
      const promise = new Promise<any[]>((resolve) => {
        employees.forEach(async (emp, index) => {
          const promise2 = new Promise<any>((resolve1) => {
            pointsPronostics = 0;
            difference = 0;
            let eventsData = [];
            if (eventsShowed.length === 0) {
              resolve1(eventsData);
            }
            eventsShowed.forEach(async (event, indexR) => {
              const totalpornosticsEmp = await TotalPronostics.findOne({
                where: {
                  employee_id: emp.id,
                  event_id: event.id,
                },
              });
              eventsData.push({
                indexR,
                event,
                totalpornosticsEmp,
              });

              if (eventsShowed.length === eventsData.length) {
                eventsData.sort((x, y) => x.indexR - y.indexR);
                resolve1({ eventsData });
              }
            });
          });
          promise2.then(async ({ eventsData }) => {
            const data = await TotalPronostics.findAll({
              where: {
                employee_id: emp.id,
                event_id: event_ids,
              },
            });

            pointsPronostics = data.reduce((accumulator, object) => {
              return accumulator + object.point;
            }, 0);
            difference = data.reduce((accumulator, object) => {
              return accumulator + object.diff;
            }, 0);
            formatData.push({ emp, eventsData, pointsPronostics, difference });

            if (employees.length === formatData.length) resolve(formatData);
          });
        });
      });
      promise.then((data) => {
        data.sort(
          (x, y) =>
            y.pointsPronostics - x.pointsPronostics ||
            y.difference - x.difference
        );
        return res.status(200).send(data);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.get(
  URLs.GET_EACH_EVENT_PRONOSTICS_EMPLOYEE_FOR_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;

      const partner = await User.findOne({
        where: {
          company_id,
          role: "partner",
        },
      });

      const actives = await UserEvents.findAll({
        where: {
          user_id: partner.id,
          is_calculated: true,
        },
        attributes: ["event_id", "is_calculated"],
      });

      const showed = await UserEvents.findAll({
        where: {
          user_id: partner.id,
          is_calculated: true,
          is_hidden: true,
        },
        attributes: ["event_id", "is_calculated", "is_hidden"],
      });

      const event_ids = actives.map((activeEvent) => activeEvent.event_id);

      const eventShowed_ids = showed.map((activeEvent) => activeEvent.event_id);

      const employees = await User.findAll({
        where: {
          company_id,
          role: "employee",
          is_active: true,
        },
        attributes: { exclude: ["password"] },
      });

      const events = await Events.findAll({
        where: {
          id: event_ids,
        },
      });

      const eventsShowed = await Events.findAll({
        where: {
          id: eventShowed_ids,
        },
      });

      let formatData = [];
      let pointsPronostics = 0;
      let difference = 0;
      const promise = new Promise<any[]>((resolve) => {
        employees.forEach(async (emp, index) => {
          const promise2 = new Promise<any>((resolve1) => {
            pointsPronostics = 0;
            difference = 0;
            let eventsData = [];
            if (eventsShowed.length === 0) {
              resolve1(eventsData);
            }
            eventsShowed.forEach(async (event, indexR) => {
              const totalpornosticsEmp = await TotalPronostics.findOne({
                where: {
                  employee_id: emp.id,
                  event_id: event.id,
                },
              });
              eventsData.push({
                indexR,
                event,
                totalpornosticsEmp,
              });

              if (eventsShowed.length === eventsData.length) {
                eventsData.sort((x, y) => x.indexR - y.indexR);
                resolve1({ eventsData });
              }
            });
          });
          promise2.then(async ({ eventsData }) => {
            const data = await TotalPronostics.findAll({
              where: {
                employee_id: emp.id,
                event_id: event_ids,
              },
            });

            pointsPronostics = data.reduce((accumulator, object) => {
              return accumulator + object.point;
            }, 0);
            difference = data.reduce((accumulator, object) => {
              return accumulator + object.diff;
            }, 0);
            formatData.push({ emp, eventsData, pointsPronostics, difference });

            if (employees.length === formatData.length) resolve(formatData);
          });
        });
      });
      promise.then((data) => {
        data.sort(
          (x, y) =>
            y.pointsPronostics - x.pointsPronostics ||
            y.difference - x.difference
        );
        return res.status(200).send(data);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.GET_ALL_PRONOSTICS_EMPLOYEE_FOR_PARTNER,
  auth,
  isActive,
  isParnter,
  async function (req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const pronostics = await Pronostics.findAll({
        where: { employee_id: id },
        include: [
          {
            model: Matchs,
            include: [
              {
                model: Equipes,
                include: [
                  {
                    model: Groupes,
                  },
                ],
              },
              {
                model: Score,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const pronosticsMatchs = await PronosticsMatchs.findAll({
        where: {
          employee_id: id,
        },
      });
      let result = [];
      pronostics.map((pronostic) => {
        const pronosticMatch = pronosticsMatchs.find(
          (x) => x.match_id === pronostic.match_id
        );
        if (pronostic.matchs.score && pronosticMatch) {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: pronosticMatch,
              score: pronostic.matchs.score,
            },
          });
        } else {
          result.push({
            id: pronostic.id,
            equipe1: pronostic.equipe1,
            equipe2: pronostic.equipe2,
            match_id: pronostic.match_id,
            employee_id: pronostic.employee_id,
            createdAt: pronostic.createdAt,
            updatedAt: pronostic.updatedAt,
            matchs: {
              id: pronostic.matchs.id,
              date: pronostic.matchs.date,
              time: pronostic.matchs.time,
              groupe_id: pronostic.matchs.groupe_id,
              coeff: pronostic.matchs.coeff,
              createdAt: pronostic.matchs.createdAt,
              updatedAt: pronostic.matchs.updatedAt,
              equipes: pronostic.matchs.equipes,
              pronosticsMatchs: {},
              score: {},
            },
          });
        }
      });
      // result = result.filter(
      //   (pronostic) =>
      //     pronostic.matchs.equipes[0].groupes[0].event_id == event_id
      // );

      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.get(
  URLs.GET_ALL_PRONOSTICS_EMPLOYEES_FOR_PARTNER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;
      const users = await User.findAll({
        where: {
          company_id,
          role: "employee",
        },
      });

      const partner = await User.findOne({
        where: { company_id, role: "partner" },
      });

      const actives = await UserEvents.findAll({
        where: { user_id: partner.id, is_hidden: true, is_calculated: true },
      });

      const event_ids = actives.map((el) => el.event_id);
      const groupesEvent = await Groupes.findAll({
        where: {
          event_id: event_ids,
        },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Matchs,
              },
            ],
          },
        ],
      });

      const grIds = groupesEvent.map((gr) => gr.id);
      let matches = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Groupes,
                include: [
                  {
                    model: Events,
                  },
                ],
              },
            ],
          },
        ],
      });
      let result = [];
      const promise = new Promise<any[]>((resolveOne) => {
        let countOne = 0;
        users.map(async (user, index) => {
          const pronostics = await Pronostics.findAll({
            where: {
              employee_id: user.id,
              match_id: {
                [Op.in]: matches.map((el) => el.id),
              },
            },
            // limit: 10,
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: Matchs,
                include: [
                  // {
                  //   model: Equipes,
                  // },
                  {
                    model: Groupes,
                    attributes: {
                      exclude: ["name", "createdAt", "updatedAt", "id"],
                    },
                  },
                  {
                    model: Score,
                  },
                ],
              },
            ],
          });
          const pronosticsMatchs = await PronosticsMatchs.findAll({
            where: {
              employee_id: user.id,
            },
          });

          const promise2 = new Promise<any[]>((resolveTwo) => {
            if (pronostics.length === 0) {
              resolveTwo(result);
            } else {
              let countP = 0;
              pronostics.map((pronostic) => {
                const pronosticMatch = pronosticsMatchs.find(
                  (x) => x.match_id === pronostic.match_id
                );
                if (pronostic.matchs.score && pronosticMatch) {
                  result.push({
                    id: pronostic.id,
                    // equipe1: pronostic.equipe1,
                    // equipe2: pronostic.equipe2,
                    // match_id: pronostic.match_id,
                    employee_id: pronostic.employee_id,
                    // createdAt: pronostic.createdAt,
                    // updatedAt: pronostic.updatedAt,
                    matchs: {
                      // id: pronostic.matchs.id,
                      // date: pronostic.matchs.date,
                      // time: pronostic.matchs.time,
                      // groupe_id: pronostic.matchs.groupe_id,
                      score_duplicate: pronostic.score_duplicate,
                      coeff: pronostic.matchs.coeff,
                      createdAt: pronostic.matchs.createdAt,
                      // updatedAt: pronostic.matchs.updatedAt,
                      equipes: pronostic.matchs.equipes,
                      groupes: pronostic.matchs.groupes,
                      pronosticsMatchs: pronosticMatch,
                      // score: pronostic.matchs.score,
                    },
                  });
                }
                countP++;
                if (pronostics.length === countP) resolveTwo(result);
              });
            }
          });
          promise2.then((data) => {
            countOne++;
            if (users.length === countOne) resolveOne(data);
          });
        });
      });
      promise.then((data) => {
        return res.status(200).send(data);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.get(
  URLs.INITIALIZATION_PRONOSTIC,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const { id, company_id } = res.locals.currentUser as User;
      let counter = 0;
      await sequelize
        .query(
          "select distinct(ust.id) as ids,sum(tp.point) as points, sum(tp.diff) as diff FROM user ust, totalPronostics tp where ust.id=tp.employee_id and ust.company_id= $company_id and  tp.event_id in (SELECT distinct(event_id) FROM `user_events` WHERE user_id= $id and is_calculated=1) and ust.role = 'employee'   group by (ust.id)",
          {
            bind: {
              id,
              company_id,
            },
          }
        )
        .then((scores: any) => {
          const promise = new Promise<void>((resolve) => {
            scores[0].forEach((score: { points: any; diff: any; ids: any }) => {
              historicScore
                .create({
                  score: score.points,
                  difference: score.diff,
                  employee_id: score.ids,
                })
                .then(() => {
                  TotalPronostics.update(
                    {
                      point: 0,
                      diff: 0,
                    },
                    {
                      where: {
                        employee_id: score.ids,
                      },
                    }
                  );
                  counter++;
                  if (counter === scores[0].length) resolve();
                })
                .catch((error) => {
                  console.log("error", error);
                });
            });
          });

          promise.then(() => {
            return res.status(200).json({
              message: MSG.CREATE_SUCCESUFULLY,
            });
          });

          promise.catch((error) => {
            console.log(error);
            return res.status(500).send({ message: MSG.CREATE_ERROR });
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).send({ message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

PronosticsRoutes.post(
  URLs.ADD_INITIAL_VALUE_TO_EMPLOYEE,
  auth,
  isActive,
  isParnter,
  async function (req, res) {
    try {
      const points = req.body.points as IPoints[];
      if (!points) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      let counter = 0;
      const promise = new Promise<void>((resolve) => {
        points.forEach((point: IPoints) => {
          TotalPronostics.update(
            {
              point: parseInt(point.initialPoints),
            },
            {
              where: {
                employee_id: point.employee,
                event_id: 0,
              },
            }
          )
            .then(() => {
              counter++;
              if (points.length === counter) resolve();
            })
            .catch((error) => {
              console.log("error", error);
              res.status(500).send({ message: MSG.UPDATED_ERROR });
            });
        });
      });

      promise
        .then(() => {
          return res.status(200).json({
            message: MSG.UPDATE_SUCSSES,
          });
        })
        .catch((error) => {
          console.log("error", error);
          res.status(500).send({ message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*** TEST CRON - DAILY REPORT ***/
PronosticsRoutes.get(
  URLs.GET_EMPLOYEE_DAILY_ACTIONS,
  async function (req, res) {
    let date = moment(eleminateHours(new Date(), 24, 0)).format("YYYY-MM-DD");
    let pronosticsEmployee: any[] = [];
    try {
      let employees = await User.findAll({
        where: {
          role: "employee",
          is_active: true,
        },
        attributes: ["id", "email"],
      });

      const groupesEvent = await Groupes.findAll({
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Matchs,
              },
            ],
          },
        ],
      });
      const grIds = groupesEvent.map((gr) => gr.id);
      const matches = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Equipes,
            attributes: ["name"],
          },
        ],
      });

      let employeesIds: number[] = employees.map((employeeId) => {
        return employeeId.id;
      });

      let counter = 0;
      let historyTable: any[] = [];
      const promise = new Promise<void>((resolve) => {
        employeesIds.forEach((employeeId: number) => {
          sequelize
            .query(
              "SELECT equipe1, equipe2, status, options, match_id as matchs, employee_id as employee, createdAt FROM `pronostics_history` where CAST(`createdAt` AS DATE) = $date AND `employee_id` = $employeeId ",
              {
                bind: {
                  employeeId,
                  date,
                },
              }
            )
            .then((pronosticHistory) => {
              historyTable = historyTable.concat(pronosticHistory[0]);
              counter++;
              if (employeesIds.length === counter) resolve();
            })
            .catch((error) => {
              console.log("error", error);
              res.status(500).send({ message: MSG.SQL_ERROR });
            });
        });
      });
      promise.then(async () => {
        historyTable.map((history) => {
          employees.map((employee) => {
            if (history.employee === employee.id)
              history.employee = employee.email;
          });
          matches.map((match) => {
            if (history.matchs === match.id)
              history.matchs = match.equipes.map((equipe) => equipe.name);
          });

          if (history.status === "create")
            history.status = "Nouvelle pronostic";
          else if (history.status === "update") history.status = "Modification";

          switch (history.options) {
            case "double_score":
              history.options = "Score Double";
              break;
            case "forgot_save":
              history.options = "Forgot Save";
              break;
            case "double_score&super_pronostic":
              history.options = "Super Pronostic & Score Double";
              break;
            case "super_pronostic":
              history.options = "Super Pronostic";
              break;
            case "double_score&forgot_save":
              history.options = "Forgot Save & Score Double";
              break;
            default:
              history.options = "Aucune option";
          }
        });

        pronosticsEmployee = historyTable.reduce(
          (result: any, currentValue: any) => {
            (result[currentValue["employee"]] =
              result[currentValue["employee"]] || []).push(currentValue);
            return result;
          },
          {}
        );
        let counterTwo = 0;
        const promiseTwo = new Promise<void>((resolve) => {
          Object.keys(pronosticsEmployee).forEach((key) => {
            let report = pronosticsEmployee[key]
              .map(
                (pronostic: {
                  status: any;
                  matchs: any[];
                  equipe1: any;
                  equipe2: any;
                  options: any;
                  createdAt: any;
                }) => {
                  return `<tr>
                              <td><i>${pronostic.status}</i></td>
                              <td>${pronostic.matchs[0]} <strong> ${
                    pronostic.equipe1
                  } </strong> - <strong> ${pronostic.equipe2} </strong>${
                    pronostic.matchs[1]
                  }</td>                 
                              <td> ${pronostic.options}</td>
                              <td>${pronostic.createdAt.getHours()}:${pronostic.createdAt.getMinutes()} </td>            
                          </tr>`;
                }
              )
              .join("");
            mail(
              key,
              "Rapport quotidien sur wind Pronostics! ",
              DailyReport(report, date)
            );
          });
          counterTwo++;
          if (Object.keys(pronosticsEmployee).length === counterTwo) resolve();
        });
        promiseTwo.then(() => {
          console.log("success");
        });
        promiseTwo.catch((error) => {
          console.log("error", error);
        });

        return res.status(200).json({
          message: MSG.UPDATE_SUCSSES,
          pronosticsEmployee: pronosticsEmployee,
        });
      });
      promise.catch((error) => {
        console.log("error", error);
        res.status(500).send({ message: MSG.SQL_ERROR });
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*** TEST CRON - COMPARAISON PRONOSTICS ***/

PronosticsRoutes.get(URLs.COMPARAISON_PRONOSTICS, async function (req, res) {
  let date = moment(eleminateHours(new Date(), 24, 0)).format("YYYY-MM-DD");
  let message: string[] = [];
  let employeesIds: number[];
  let matchsIds: number[];
  let historyTable: any[] = [];

  try {
    const groupesEvent = await Groupes.findAll({
      include: [
        {
          model: Equipes,
          include: [
            {
              model: Matchs,
            },
          ],
        },
      ],
    });

    const grIds = groupesEvent.map((gr) => gr.id);
    const matches = await Matchs.findAll({
      where: {
        groupe_id: { [Op.in]: grIds },
      },
      include: [
        {
          model: Equipes,
          attributes: ["name"],
        },
      ],
    });

    const employeesEmails = await User.findAll({
      where: {
        role: "employee",
        is_active: true,
        company_id: 10,
      },
      attributes: ["id", "email"],
    });

    await sequelize
      .query(
        "SELECT id FROM `user` where `company_id` = 10 AND `role`= 'employee'"
      )
      .then((employees) => {
        employeesIds = employees[0].map((employee: { id: number }) => {
          return employee.id;
        });
      })
      .catch((err) => console.log(err, "err"));

    await sequelize
      .query("SELECT id from matchs where  CAST(date AS DATE) =$date", {
        bind: {
          date,
        },
      })
      .then((matchs) => {
        matchsIds = matchs[0].map((match: { id: number }) => {
          return match.id;
        });
      })
      .catch((err) => console.log(err, "err"));
    let counter = 0;
    const t = await sequelize.transaction();
    const promise = new Promise<void>((resolve) => {
      employeesIds.forEach((employeeId: number) => {
        matchsIds.forEach((matchId: number) => {
          sequelize
            .query(
              "SELECT equipe1 as hTeam1, equipe2 as hTeam2, match_id as hMatchId, employee_id as hEmployeeId FROM `pronostics_history` where `match_id` = $matchId  and `employee_id`= $employeeId GROUP by createdAt DESC LIMIT 1 ",
              {
                bind: {
                  employeeId,
                  matchId,
                },
                transaction: t,
              }
            )
            .then((pronosticHistory) => {
              historyTable = historyTable.concat(pronosticHistory[0]);
              counter++;
              if (matchsIds.length * employeesIds.length === counter) resolve();
            })
            .catch((error) => {
              console.log("error1", error);
              res.status(500).send({ message: MSG.SQL_ERROR });
            });
        });
      });
      if (matchsIds.length * employeesIds.length === counter) resolve();
      counter++;
    });
    promise
      .then(() => {
        t.commit();

        sequelize
          .query(
            "SELECT p.equipe1 as team1, p.equipe2 as team2, p.match_id as matchId, p.employee_id as employeeId FROM `pronostics` AS p JOIN `user` as u ON u.id = p.employee_id JOIN `matchs` as m ON m.id = p.match_id WHERE u.is_active = 1 AND u.company_id = 10 AND role= 'employee' AND CAST(m.date AS DATE) = $date",
            {
              bind: {
                date,
              },
            }
          )
          .then((pronostics) => {
            let allPronostics: any[] = pronostics[0];
            historyTable.map((history, index) => {
              matches.map((match) => {
                if (history.hMatchId === match.id)
                  historyTable[index].hMatch = match.equipes.map(
                    (equipe) => equipe.name
                  );
              });

              employeesEmails.map((employee) => {
                if (history.hEmployeeId === employee.id)
                  historyTable[index].hEmployee = employee.email;
              });
            });

            allPronostics.map((pronostic: any, index) => {
              matches.map((match) => {
                if (pronostic.matchId === match.id)
                  allPronostics[index].match = match.equipes.map(
                    (equipe) => equipe.name
                  );
              });

              employeesEmails.map((employee) => {
                if (pronostic.employeeId === employee.id)
                  allPronostics[index].employee = employee.email;
              });
            });

            historyTable.map((history: any) => {
              allPronostics.map((pronostic: any) => {
                if (
                  history.hMatchId === pronostic.matchId &&
                  history.hEmployeeId === pronostic.employeeId &&
                  (history.hTeam1 !== pronostic.team1 ||
                    history.hTeam2 !== pronostic.team2)
                )
                  message.push(
                    "Un erreur produit avec l'employee : " +
                      pronostic.employee +
                      " dans Match " +
                      history.hMatch[0] +
                      " - " +
                      history.hMatch[1] +
                      " dernière résultat dans l'historique " +
                      history.hTeam1 +
                      " - " +
                      history.hTeam2 +
                      " mais le résultat affiché " +
                      pronostic.team1 +
                      " - " +
                      pronostic.team2 +
                      "<br/>"
                  );
              });
            });
            mail(
              "nourtst1@gmail.com",
              "Un erreur produit sur wind Pronostics! ",
              WarningInPronostics(message)
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.log("error3", error);
      });
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});

export { PronosticsRoutes };
