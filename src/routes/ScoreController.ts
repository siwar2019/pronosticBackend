import { MatchEquipes } from "./../sqlModels/matchEquipes";
import express from "express";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { sequelize } from "../sequelize";
import { Equipes } from "../sqlModels/equipe";
import { Groupes } from "../sqlModels/groupes";
import { Matchs } from "../sqlModels/Matchs";
import { Order } from "../sqlModels/order";
import { Order_Match } from "../sqlModels/order_match";
import { Pronostics } from "../sqlModels/pronostic";
import { PronosticsMatchs } from "../sqlModels/pronosticsMatchs";
import { Score } from "../sqlModels/score";
import { TotalPronostics } from "../sqlModels/totalPronostics";
import { User } from "../sqlModels/user";
import { URLs, MSG } from "../util/translate/fr/translateFR";

//***************API get liste score*************** */
const ScoreRoutes = express.Router();
ScoreRoutes.get(
  URLs.GETSCORE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const listScore: Score[] = await Score.findAll();
      return res.status(200).json(listScore);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
//***************get liste partner by id *****************/

ScoreRoutes.get(
  URLs.GetScoreById,
  auth,
  isActive,
  isAdmin,
  async (req, res) => {
    let Id = req.query.Id as string;

    if (!Id)
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });

    const eq: Score | null = await Score.findByPk(Id);
    if (eq) {
      return res.status(200).json(eq);
    } else {
      return res
        .status(400)
        .send({ success: false, message: MSG.USER_NOT_FOUND });
    }
  }
);
//******************Delete partner *********************** */

ScoreRoutes.post(
  URLs.DELETESCORE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    const Id = req.body.Id;
    if (!Id) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      await sequelize
        .query("Select count(*) as counteVENT from score WHERE Id =$Id ", {
          bind: { Id: Id },
        })
        .then(async (data: any) => {
          if (data[0][0].counteVENT !== 1) {
            res
              .status(400)
              .send({ success: false, message: MSG.SCORE_NOTFIND });
          } else {
            await sequelize
              .query("Delete from score where Id  = $Id ", {
                bind: {
                  Id: Id,
                },
              })
              .then(() => {
                return res.status(200).send({
                  success: true,
                  message: MSG.DELETEDSCORE,
                });
              })
              .catch((err) => {
                console.log("error", err);
                res.status(500).send({ message: MSG.SQL_ERROR });
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
          res.status(500).send({ message: MSG.SQL_ERROR });
        });
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

//***************EDIT Partner ***********/
ScoreRoutes.put(
  URLs.UpdateScore,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    const Id = req.body.Id;
    const Name = req.body.Name;

    if (!Id || !Name) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
    }

    try {
      await sequelize
        .query("Select count(*) as countDesignation from score WHERE Id=$Id", {
          bind: { Id: Id },
        })
        .then(async (data: any) => {
          if (data[0][0].countDesignation !== 1) {
            res
              .status(400)
              .send({ success: false, message: MSG.USER_NOT_FOUND });
          } else {
            await sequelize
              .query("UPDATE score SET Id=$Id,Name=$Name WHERE Id=$Id", {
                bind: {
                  Id: Id,
                  Name: Name,
                },
              })
              .then(() => {
                return res.status(200).send({
                  success: true,
                  message: MSG.UPDATED_SUCCESUFULLY,
                });
              })
              .catch((err) => {
                console.log("error", err);
                res.status(500).send({ message: MSG.SQL_ERROR });
              });
          }
        })
        .catch((error) => {
          res.status(500).send({ message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

ScoreRoutes.post(
  URLs.CREATE_SCORE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { equipe1, equipe2, match_id, coeff } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !coeff) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      if (
        parseInt(equipe1) < 0 ||
        parseInt(equipe2) < 0 ||
        parseInt(coeff) < 0 ||
        !Number.isInteger(parseFloat(equipe1)) ||
        !Number.isInteger(parseFloat(equipe2)) ||
        !Number.isInteger(parseFloat(coeff))
      ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.INVALID_SCORE });
      }

      const match = await Matchs.findOne({
        where: { id: match_id },
        include: [
          {
            model: Equipes,
          },
          {
            model: Groupes,
          },
        ],
      });
      if (!match) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_NOTFIND });
      }

      const scoreMatch = await Score.findOne({
        where: {
          match_id: match.id,
        },
      });

      if (scoreMatch) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_HAVE_SCORE });
      }

      const score = await Score.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
      });

      const eq1 = await MatchEquipes.findOne({
        where: {
          match_id: match.id,
          order: true,
        },
      });
      const eq2 = await MatchEquipes.findOne({
        where: {
          match_id: match.id,
          order: false,
        },
      });

      if (parseInt(equipe1) > parseInt(equipe2)) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            mp: order1.mp + 1,
            w: order1.w + 1,
            pt: order1.pt + 3,
            but: order1.but + parseInt(equipe1),
            o_but: order1.o_but + parseInt(equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            mp: order2.mp + 1,
            l: order2.l + 1,
            but: order2.but + parseInt(equipe2),
            o_but: order2.o_but + parseInt(equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
        await Order_Match.create({
          form: "W",
          order_id: order1.id,
          match_id: match.id,
          equipe_id: eq1.equipe_id,
          groupe_id: order1.groupe_id,
        });
        await Order_Match.create({
          form: "L",
          order_id: order2.id,
          match_id: match.id,
          equipe_id: eq2.equipe_id,
          groupe_id: order2.groupe_id,
        });
      }

      if (parseInt(equipe1) < parseInt(equipe2)) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            mp: order1.mp + 1,
            l: order1.l + 1,
            but: order1.but + parseInt(equipe1),
            o_but: order1.o_but + parseInt(equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            mp: order2.mp + 1,
            w: order2.w + 1,
            pt: order2.pt + 3,
            but: order2.but + parseInt(equipe2),
            o_but: order2.o_but + parseInt(equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
        await Order_Match.create({
          form: "L",
          order_id: order1.id,
          match_id: match.id,
          equipe_id: eq1.equipe_id,
          groupe_id: order1.groupe_id,
        });
        await Order_Match.create({
          form: "W",
          order_id: order2.id,
          match_id: match.id,
          equipe_id: eq2.equipe_id,
          groupe_id: order2.groupe_id,
        });
      }
      if (parseInt(equipe1) == parseInt(equipe2)) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            mp: order1.mp + 1,
            d: order1.d + 1,
            pt: order1.pt + 1,
            but: order1.but + parseInt(equipe1),
            o_but: order1.o_but + parseInt(equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            mp: order2.mp + 1,
            d: order2.d + 1,
            pt: order2.pt + 1,
            but: order2.but + parseInt(equipe2),
            o_but: order2.o_but + parseInt(equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
        await Order_Match.create({
          form: "D",
          order_id: order1.id,
          match_id: match.id,
          equipe_id: eq1.equipe_id,
          groupe_id: order1.groupe_id,
        });
        await Order_Match.create({
          form: "D",
          order_id: order2.id,
          match_id: match.id,
          equipe_id: eq2.equipe_id,
          groupe_id: order2.groupe_id,
        });
      }

      await Matchs.update(
        {
          coeff: parseInt(coeff),
        },
        {
          where: { id: match_id },
        }
      );

      const pronostics = await Pronostics.findAll({
        where: { match_id },
      });
      let employees = [];
      if (pronostics.length !== 0) {
        pronostics.map(async (pronostic, index) => {
          employees.push(pronostic.employee_id);
          let diffButs = 0;
          let equipeWin = 0;
          let point = 0;
          let diff = 0;
          if (
            pronostic.equipe1 == score.equipe1 &&
            pronostic.equipe2 == score.equipe2
          ) {
            await PronosticsMatchs.create({
              point: 3 * parseInt(coeff) * pronostic.score_duplicate,
              diff: 0,
              match_id: pronostic.match_id,
              employee_id: pronostic.employee_id,
            });
            const pronosticsTotalEmp = await TotalPronostics.findOne({
              where: {
                employee_id: pronostic.employee_id,
                event_id: match.groupes.event_id,
              },
            });

            await TotalPronostics.update(
              {
                point:
                  pronosticsTotalEmp.point +
                  3 * parseInt(coeff) * pronostic.score_duplicate,
                diff: pronosticsTotalEmp.diff + 0,
              },
              {
                where: {
                  employee_id: pronostic.employee_id,
                  event_id: match.groupes.event_id,
                },
              }
            );
          } else {
            score.equipe1 > score.equipe2
              ? (equipeWin = 1)
              : score.equipe1 < score.equipe2
              ? (equipeWin = 2)
              : (equipeWin = 0);
            diffButs = Math.abs(
              parseInt(score.equipe1) - parseInt(score.equipe2)
            );
            let equipeWinEmp = 0;
            pronostic.equipe1 > pronostic.equipe2
              ? (equipeWinEmp = 1)
              : pronostic.equipe1 < pronostic.equipe2
              ? (equipeWinEmp = 2)
              : (equipeWinEmp = 0);

            if (equipeWin === equipeWinEmp) {
              if (
                diffButs ===
                Math.abs(
                  parseInt(pronostic.equipe1) - parseInt(pronostic.equipe2)
                )
              ) {
                point = 2;
                diff = 0;
                await PronosticsMatchs.create({
                  point: point * parseInt(coeff) * pronostic.score_duplicate,
                  diff: diff,
                  match_id: pronostic.match_id,
                  employee_id: pronostic.employee_id,
                });
                const pronosticsTotalEmp = await TotalPronostics.findOne({
                  where: {
                    employee_id: pronostic.employee_id,
                    event_id: match.groupes.event_id,
                  },
                });

                await TotalPronostics.update(
                  {
                    point:
                      pronosticsTotalEmp.point +
                      2 * parseInt(coeff) * pronostic.score_duplicate,
                    diff: pronosticsTotalEmp.diff + 0,
                  },
                  {
                    where: {
                      employee_id: pronostic.employee_id,
                      event_id: match.groupes.event_id,
                    },
                  }
                );
              } else {
                point = 1;
                diff = -Math.abs(
                  diffButs -
                    Math.abs(
                      parseInt(pronostic.equipe1) - parseInt(pronostic.equipe2)
                    )
                );
                await PronosticsMatchs.create({
                  point: point * parseInt(coeff) * pronostic.score_duplicate,
                  diff: diff,
                  match_id: pronostic.match_id,
                  employee_id: pronostic.employee_id,
                });
                const pronosticsTotalEmp = await TotalPronostics.findOne({
                  where: {
                    employee_id: pronostic.employee_id,
                    event_id: match.groupes.event_id,
                  },
                });

                await TotalPronostics.update(
                  {
                    point:
                      pronosticsTotalEmp.point +
                      1 * parseInt(coeff) * pronostic.score_duplicate,
                    diff: pronosticsTotalEmp.diff + diff,
                  },
                  {
                    where: {
                      employee_id: pronostic.employee_id,
                      event_id: match.groupes.event_id,
                    },
                  }
                );
              }
            } else {
              point = 0;
              diff =
                -Math.abs(
                  parseInt(pronostic.equipe1) - parseInt(pronostic.equipe2)
                ) - diffButs;
              await PronosticsMatchs.create({
                point: point * parseInt(coeff) * pronostic.score_duplicate,
                diff: diff,
                match_id: pronostic.match_id,
                employee_id: pronostic.employee_id,
              });
              const pronosticsTotalEmp = await TotalPronostics.findOne({
                where: {
                  employee_id: pronostic.employee_id,
                  event_id: match.groupes.event_id,
                },
              });

              await TotalPronostics.update(
                {
                  point:
                    pronosticsTotalEmp.point +
                    0 * parseInt(coeff) * pronostic.score_duplicate,
                  diff: pronosticsTotalEmp.diff + diff,
                },
                {
                  where: {
                    employee_id: pronostic.employee_id,
                    event_id: match.groupes.event_id,
                  },
                }
              );
            }
          }
          if (pronostics.length === index + 1) {
            const totalPronosticByEvent = await TotalPronostics.findAll({
              where: {
                event_id: match.groupes.event_id,
              },
            });

            totalPronosticByEvent
              .filter((x) => !employees.includes(x.employee_id))
              .map(async (data) => {
                await TotalPronostics.update(
                  {
                    diff: data.diff - 5,
                  },
                  {
                    where: {
                      id: data.id,
                    },
                  }
                );
              });

            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
          }
        });
      } else {
        const totalPronosticByEvent = await TotalPronostics.findAll({
          where: {
            event_id: match.groupes.event_id,
          },
        });

        totalPronosticByEvent.map(async (data) => {
          await TotalPronostics.update(
            {
              diff: data.diff - 5,
            },
            {
              where: {
                id: data.id,
              },
            }
          );
        });

        return res.status(200).send({
          message: MSG.CREATE_SUCCESUFULLY,
        });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

ScoreRoutes.post(
  URLs.UPDATE_SCORE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
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

      const match = await Matchs.findOne({
        where: { id: match_id },
        include: [
          {
            model: Equipes,
          },
          {
            model: Groupes,
          },
        ],
      });
      if (!match) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_NOTFIND });
      }
      const score = await Score.findOne({
        where: {
          match_id: match.id,
        },
      });
      if (!score) {
        return res.status(400).send({
          success: false,
          message: MSG.MATCH_DONT_HAVE_SCORE_TO_UPDATE,
        });
      }
      const eq1 = await MatchEquipes.findOne({
        where: {
          match_id: match.id,
          order: true,
        },
      });
      const eq2 = await MatchEquipes.findOne({
        where: {
          match_id: match.id,
          order: false,
        },
      });
      if (parseInt(equipe1) > parseInt(equipe2)) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            w: order1.w + 1,
            pt: order1.pt + 3,
            but: order1.but + parseInt(equipe1),
            o_but: order1.o_but + parseInt(equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            l: order2.l + 1,
            but: order2.but + parseInt(equipe2),
            o_but: order2.o_but + parseInt(equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
        await Order_Match.update(
          {
            form: "W",
          },
          {
            where: {
              order_id: order1.id,
              match_id: match.id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        await Order_Match.update(
          {
            form: "L",
          },
          {
            where: {
              order_id: order2.id,
              match_id: match.id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
      }
      if (parseInt(equipe1) < parseInt(equipe2)) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            l: order1.l + 1,
            but: order1.but + parseInt(equipe1),
            o_but: order1.o_but + parseInt(equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            w: order2.w + 1,
            pt: order2.pt + 3,
            but: order2.but + parseInt(equipe2),
            o_but: order2.o_but + parseInt(equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
        await Order_Match.update(
          {
            form: "L",
          },
          {
            where: {
              order_id: order1.id,
              match_id: match.id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        await Order_Match.update(
          {
            form: "W",
          },
          {
            where: {
              order_id: order2.id,
              match_id: match.id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
      }
      if (parseInt(equipe1) == parseInt(equipe2)) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            d: order1.d + 1,
            pt: order1.pt + 1,
            but: order1.but + parseInt(equipe1),
            o_but: order1.o_but + parseInt(equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            d: order2.d + 1,
            pt: order2.pt + 1,
            but: order2.but + parseInt(equipe2),
            o_but: order2.o_but + parseInt(equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
        await Order_Match.update(
          {
            form: "D",
          },
          {
            where: {
              order_id: order1.id,
              match_id: match.id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        await Order_Match.update(
          {
            form: "D",
          },
          {
            where: {
              order_id: order2.id,
              match_id: match.id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
      }
      if (score.equipe1 > score.equipe2) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            w: order1.w - 1,
            pt: order1.pt - 3,
            but: order1.but - parseInt(score.equipe1),
            o_but: order1.o_but - parseInt(score.equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            l: order2.l - 1,
            but: order2.but - parseInt(score.equipe2),
            o_but: order2.o_but - parseInt(score.equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
      }
      if (score.equipe1 < score.equipe2) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            l: order1.l - 1,
            but: order1.but - parseInt(score.equipe1),
            o_but: order1.o_but - parseInt(score.equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            w: order2.w - 1,
            pt: order2.pt - 3,
            but: order2.but - parseInt(score.equipe2),
            o_but: order2.o_but - parseInt(score.equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq2.equipe_id,
            },
          }
        );
      }
      if (score.equipe1 == score.equipe2) {
        const order1 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq1.equipe_id,
          },
        });
        await Order.update(
          {
            d: order1.d - 1,
            pt: order1.pt - 1,
            but: order1.but - parseInt(score.equipe1),
            o_but: order1.o_but - parseInt(score.equipe2),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
        const order2 = await Order.findOne({
          where: {
            groupe_id: match.groupe_id,
            equipe_id: eq2.equipe_id,
          },
        });
        await Order.update(
          {
            d: order2.d - 1,
            pt: order2.pt - 1,
            but: order2.but - parseInt(score.equipe2),
            o_but: order2.o_but - parseInt(score.equipe1),
          },
          {
            where: {
              groupe_id: match.groupe_id,
              equipe_id: eq1.equipe_id,
            },
          }
        );
      }
      const pronostics = await Pronostics.findAll({
        where: { match_id },
      });

      const pronosticsMatchs = await PronosticsMatchs.findAll({
        where: {
          match_id,
        },
      });
      let employees = [];
      if (pronostics.length !== 0) {
        const promise = new Promise<void>(async (resolve, reject) => {
          pronosticsMatchs.map(async (pronosticsMatch, index) => {
            employees.push(pronosticsMatch.employee_id);
            const pronosticsTotalEmp = await TotalPronostics.findOne({
              where: {
                employee_id: pronosticsMatch.employee_id,
                event_id: match.groupes.event_id,
              },
            });
            await TotalPronostics.update(
              {
                point: pronosticsTotalEmp.point - pronosticsMatch.point,
                diff: pronosticsTotalEmp.diff - pronosticsMatch.diff,
              },
              {
                where: {
                  employee_id: pronosticsMatch.employee_id,
                  event_id: match.groupes.event_id,
                },
              }
            );
            await PronosticsMatchs.update(
              {
                point: 0,
                diff: 0,
              },
              {
                where: {
                  match_id: pronosticsMatch.match_id,
                  employee_id: pronosticsMatch.employee_id,
                },
              }
            );

            if (pronostics.length === index + 1) {
              const totalPronosticByEvent = await TotalPronostics.findAll({
                where: {
                  event_id: match.groupes.event_id,
                },
              });
              totalPronosticByEvent
                .filter((x) => !employees.includes(x.employee_id))
                .map(async (data, indexR) => {
                  await TotalPronostics.update(
                    {
                      diff: data.diff + 5,
                    },
                    {
                      where: {
                        id: data.id,
                      },
                    }
                  );
                  if (
                    totalPronosticByEvent.filter(
                      (x) => !employees.includes(x.employee_id)
                    ).length ===
                    indexR + 1
                  ) {
                    resolve();
                  }
                });
            }
          });
        });
        promise.then(async () => {
          employees = [];
          await Score.update(
            {
              equipe1,
              equipe2,
            },
            {
              where: {
                match_id: match.id,
              },
            }
          );
          const scoreMatch = await Score.findOne({
            where: {
              match_id: match.id,
            },
          });
          pronostics.map(async (pronostic, index) => {
            employees.push(pronostic.employee_id);
            let diffButs = 0;
            let equipeWin = 0;
            let point = 0;
            let diff = 0;
            if (
              pronostic.equipe1 === scoreMatch.equipe1 &&
              pronostic.equipe2 === scoreMatch.equipe2
            ) {
              await PronosticsMatchs.update(
                {
                  point: 3 * match.coeff * pronostic.score_duplicate,
                  diff: 0,
                },
                {
                  where: {
                    match_id: pronostic.match_id,
                    employee_id: pronostic.employee_id,
                  },
                }
              );
              const pronosticsTotalEmp = await TotalPronostics.findOne({
                where: {
                  employee_id: pronostic.employee_id,
                  event_id: match.groupes.event_id,
                },
              });

              await TotalPronostics.update(
                {
                  point:
                    pronosticsTotalEmp.point +
                    3 * match.coeff * pronostic.score_duplicate,
                  diff: pronosticsTotalEmp.diff + 0,
                },
                {
                  where: {
                    employee_id: pronostic.employee_id,
                    event_id: match.groupes.event_id,
                  },
                }
              );
            } else {
              scoreMatch.equipe1 > scoreMatch.equipe2
                ? (equipeWin = 1)
                : scoreMatch.equipe1 < scoreMatch.equipe2
                ? (equipeWin = 2)
                : (equipeWin = 0);
              diffButs = Math.abs(
                parseInt(scoreMatch.equipe1) - parseInt(scoreMatch.equipe2)
              );
              let equipeWinEmp = 0;
              pronostic.equipe1 > pronostic.equipe2
                ? (equipeWinEmp = 1)
                : pronostic.equipe1 < pronostic.equipe2
                ? (equipeWinEmp = 2)
                : (equipeWinEmp = 0);

              if (equipeWin === equipeWinEmp) {
                if (
                  diffButs ===
                  Math.abs(
                    parseInt(pronostic.equipe1) - parseInt(pronostic.equipe2)
                  )
                ) {
                  point = 2;
                  diff = 0;
                  await PronosticsMatchs.update(
                    {
                      point: point * match.coeff * pronostic.score_duplicate,
                      diff: diff,
                    },
                    {
                      where: {
                        match_id: pronostic.match_id,
                        employee_id: pronostic.employee_id,
                      },
                    }
                  );
                  const pronosticsTotalEmp = await TotalPronostics.findOne({
                    where: {
                      employee_id: pronostic.employee_id,
                      event_id: match.groupes.event_id,
                    },
                  });

                  await TotalPronostics.update(
                    {
                      point:
                        pronosticsTotalEmp.point +
                        2 * match.coeff * pronostic.score_duplicate,
                      diff: pronosticsTotalEmp.diff + 0,
                    },
                    {
                      where: {
                        employee_id: pronostic.employee_id,
                        event_id: match.groupes.event_id,
                      },
                    }
                  );
                } else {
                  point = 1;
                  diff = -Math.abs(
                    diffButs -
                      Math.abs(
                        parseInt(pronostic.equipe1) -
                          parseInt(pronostic.equipe2)
                      )
                  );
                  await PronosticsMatchs.update(
                    {
                      point: point * match.coeff * pronostic.score_duplicate,
                      diff: diff,
                    },
                    {
                      where: {
                        match_id: pronostic.match_id,
                        employee_id: pronostic.employee_id,
                      },
                    }
                  );
                  const pronosticsTotalEmp = await TotalPronostics.findOne({
                    where: {
                      employee_id: pronostic.employee_id,
                      event_id: match.groupes.event_id,
                    },
                  });

                  await TotalPronostics.update(
                    {
                      point:
                        pronosticsTotalEmp.point +
                        1 * match.coeff * pronostic.score_duplicate,
                      diff: pronosticsTotalEmp.diff + diff,
                    },
                    {
                      where: {
                        employee_id: pronostic.employee_id,
                        event_id: match.groupes.event_id,
                      },
                    }
                  );
                }
              } else {
                point = 0;
                diff =
                  -Math.abs(
                    parseInt(pronostic.equipe1) - parseInt(pronostic.equipe2)
                  ) - diffButs;
                await PronosticsMatchs.update(
                  {
                    point: point * match.coeff * pronostic.score_duplicate,
                    diff: diff,
                  },
                  {
                    where: {
                      match_id: pronostic.match_id,
                      employee_id: pronostic.employee_id,
                    },
                  }
                );
                const pronosticsTotalEmp = await TotalPronostics.findOne({
                  where: {
                    employee_id: pronostic.employee_id,
                    event_id: match.groupes.event_id,
                  },
                });

                await TotalPronostics.update(
                  {
                    point:
                      pronosticsTotalEmp.point +
                      0 * match.coeff * pronostic.score_duplicate,
                    diff: pronosticsTotalEmp.diff + diff,
                  },
                  {
                    where: {
                      employee_id: pronostic.employee_id,
                      event_id: match.groupes.event_id,
                    },
                  }
                );
              }
            }
            if (pronostics.length === index + 1) {
              const totalPronosticByEvent = await TotalPronostics.findAll({
                where: {
                  event_id: match.groupes.event_id,
                },
              });

              totalPronosticByEvent
                .filter((x) => !employees.includes(x.employee_id))
                .map(async (data) => {
                  await TotalPronostics.update(
                    {
                      diff: data.diff - 5,
                    },
                    {
                      where: {
                        id: data.id,
                      },
                    }
                  );
                });

              return res.status(200).send({
                message: MSG.UPDATED_SUCCESUFULLY,
              });
            }
          });
        });
      } else {
        await Score.update(
          {
            equipe1,
            equipe2,
          },
          {
            where: {
              match_id: match.id,
            },
          }
        );
        return res.status(200).send({
          message: MSG.CREATE_SUCCESUFULLY,
        });
      }
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { ScoreRoutes };
