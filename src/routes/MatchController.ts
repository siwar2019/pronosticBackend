import { Categories } from "./../sqlModels/categories";
import express from "express";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import isEmployee from "../middlewares/employee";
import isPartner from "../middlewares/partner";
import { Equipes } from "../sqlModels/equipe";
import { Events } from "../sqlModels/events";
import { Groupes } from "../sqlModels/groupes";
import { MatchEquipes } from "../sqlModels/matchEquipes";
import { Matchs } from "../sqlModels/Matchs";
import { Pronostics } from "../sqlModels/pronostic";
import { Score } from "../sqlModels/score";
import { User } from "../sqlModels/user";
import { UserEvents } from "../sqlModels/userEvents";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
import { Op, where } from "sequelize";
import { Order_Match } from "../sqlModels/order_match";
import { PronosticsMatchs } from "../sqlModels/pronosticsMatchs";
import { GroupeEquipes } from "../sqlModels/groupeEquipes";
import { Order } from "../sqlModels/order";

const MatchRoutes = express.Router();

/*            ****** Create Matchs  ******      */

const createMatch = async (
  equipes: any,
  groupeId: number,
  start: number,
  end: number
) => {
  for (let index = start; index < end; index++) {
    const match: any | null = await Matchs.create({ groupe_id: groupeId });
    await match.$add("equipe", equipes[start]);
    await match.$add("equipe", equipes[index + 1]);
  }
};

MatchRoutes.post(
  URLs.CREATE_MATCHES,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    const groupeId = req.body.id;
    try {
      if (!groupeId) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const groupe: any | null = await Groupes.findOne({
        include: [
          {
            model: Equipes,
            as: "equipes",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
        ],
        where: { id: groupeId },
      });
      if (!groupe) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
      for (let index = 0; index < groupe.equipes.length; index++) {
        await createMatch(
          groupe.equipes,
          groupeId,
          index,
          groupe.equipes.length - 1
        );
      }
      return res.status(200).send({
        message: "sucssees",
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
/*            ****** Get List Match by Groupe  ******      */

MatchRoutes.get(
  URLs.GET_MATCH_BY_GROUPE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const id = req.query.id as string;
      const listeEquipes: Matchs[] = await Matchs.findAll({
        include: [
          {
            model: Equipes,
          },
          {
            model: Score,
          },
        ],
        where: { groupe_id: id },
      });
      return res.status(200).send(listeEquipes);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
// MatchRoutes.get(URLs.GETMATCHS, async function (req, res) {
//   try {
//     console.log("inside api get match");
//     const listEquipe: Matchs[] = await Matchs.findAll();
//     return res.status(200).json(listEquipe);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ message: MSG.SQL_ERROR });
//   }
// });
// //***************get liste equipe by id *****************/
// MatchRoutes.get(URLs.GetMatchById, async (req, res) => {
//   let Id = req.query.Id as string;
//   if (!Id)
//     return res.status(400).send({ success: false, message: MSG.DATA_MISSING });

//   const eq: Matchs | null = await Matchs.findByPk(Id);
//   if (eq) {
//     return res.status(200).json(eq);
//   } else {
//     return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
//   }
// });
// //******************Delete equipe *********************** */

// MatchRoutes.post(URLs.DeleteMatch, async function (req, res) {
//   const Id = req.body.Id;
//   if (!Id) {
//     return res.status(400).send({ success: false, message: MSG.DATA_MISSING });
//   }

//   try {
//     await sequelize
//       .query(
//         "Select count(*) as CountMatch from matchs WHERE Id =$Id ",
//         {
//           bind: { Id: Id },
//         }
//       )
//       .then(async (data: any) => {
//         if (data[0][0].CountMatch !== 1) {
//           res.status(400).send({ success: false, message: MSG.EQUIPE_NOTFIND });
//         } else {
//           await sequelize
//             .query("Delete from matchs where Id  = $Id ", {
//               bind: {
//                 Id: Id,
//               },
//             })
//             .then(() => {
//               return res.status(200).send({
//                 success: true,
//                 message: MSG.DELETED_SUCCUSSFULLY,
//               });
//             })
//             .catch((err) => {
//               console.log("error", err);
//               res.status(500).send({ message: MSG.SQL_ERROR });
//             });
//         }
//       })
//       .catch((error) => {
//         console.log("error", error);
//         res.status(500).send({ message: MSG.SQL_ERROR });
//       });
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).send({ message: MSG.SQL_ERROR });
//   }
// });
// //***************EDIT EQUIPE ***********/
// MatchRoutes.put(URLs.UpdateMatch, async function (req, res) {
//   const Id = req.body.Id;
//   const Equipe1 = req.body.Equipe1;
//   const Equipe2 = req.body.Equipe2;

//   if (!Id || !Equipe1 || !Equipe2) {
//     return res
//       .status(400)
//       .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
//   }

//   try {
//     await sequelize
//       .query(
//         "Select count(*) as countMatchs from matchs WHERE Id=$Id",
//         {
//           bind: { Id: Id },
//         }
//       )
//       .then(async (data: any) => {
//         if (data[0][0].countMatchs !== 1) {
//           res.status(400).send({ success: false, message: MSG.USER_NOT_FOUND });
//         } else {
//           await sequelize
//             .query(
//               "UPDATE matchs SET Id=$Id,Equipe1=$Equipe1,Equipe2=$Equipe2 WHERE Id=$Id",
//               {
//                 bind: {
//                   Id: Id,
//                   Equipe1: Equipe1,
//                   Equipe2: Equipe2,
//                 },
//               }
//             )
//             .then(() => {
//               return res.status(200).send({
//                 success: true,
//                 message: MSG.UPDATED_SUCCESUFULLY,
//               });
//             })
//             .catch((err) => {
//               console.log("error", err);
//               res.status(500).send({ message: MSG.SQL_ERROR });
//             });
//         }
//       })
//       .catch((error) => {
//         res.status(500).send({ message: MSG.SQL_ERROR });
//       });
//   } catch (error) {
//     res.status(500).send({ message: MSG.SQL_ERROR });
//   }
// });

// //***************get match by id *****************/

MatchRoutes.get(
  URLs.GetMatchById,
  auth,
  isActive,
  isAdmin,
  async (req, res) => {
    try {
      let id = req.query.id as string;

      if (!id) return res.status(400).send({ message: MSG.DATA_MISSING });

      const match: Matchs | null = await Matchs.findOne({
        include: [Equipes],
        where: { id: id },
      });
      if (match) {
        return res.status(200).send(match);
      } else {
        return res.status(400).send({ message: MSG.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.CREATE_MATCHES_GROUPES,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
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
      // const matchesCreated = await Matchs.findAll({
      //   include: [
      //     {
      //       model: Groupes,
      //       include: [
      //         {
      //           model: Events,
      //           where: { id: event_id },
      //         },
      //       ],
      //     },
      //   ],
      // });

      const grIds = groupes.map((gr) => gr.id);
      const matchesCreated = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
        },
        include: [
          {
            model: Groupes,
          },
        ],
      });

      if (matchesCreated.length === 0) {
        const groupesIds = matchesCreated.map((el) => el.groupes.id);
        groupes.map(async (groupe) => {
          if (!groupesIds.includes(groupe.id)) {
            groupe.equipes.forEach(async (equipe, index) => {
              for (let i = index + 1; i < groupe.equipes.length; i++) {
                Matchs.create({
                  groupe_id: groupe.id,
                }).then((match) => {
                  MatchEquipes.create({
                    match_id: match.id,
                    equipe_id: equipe.id,
                  });
                  MatchEquipes.create({
                    match_id: match.id,
                    equipe_id: groupe.equipes[i].id,
                  });
                });
              }
            });
          }
        });
      }

      if (matchesCreated.length > 0) {
        const groupesIds = matchesCreated.map((el) => el.groupes.id);
        groupes.map((groupe) => {
          if (!groupesIds.includes(groupe.id)) {
            groupe.equipes.forEach(async (equipe, index) => {
              for (let i = index + 1; i < groupe.equipes.length; i++) {
                Matchs.create({
                  groupe_id: groupe.id,
                }).then((match) => {
                  MatchEquipes.create({
                    match_id: match.id,
                    equipe_id: equipe.id,
                  });
                  MatchEquipes.create({
                    match_id: match.id,
                    equipe_id: groupe.equipes[i].id,
                  });
                });
              }
            });
          }
        });
      }
      return res.status(200).send({
        message: MSG.CREATE_SUCCESUFULLY,
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_EVENT_FOR_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      let matchess = await Matchs.findAll({
        where: {
          date: null,
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

      matchess = matchess.filter((el) => el.equipes.length > 0);

      let groupesMatch = [];
      let groupes: Groupes[] = [];
      matchess.map((match, index) => {
        if (groupes.length === 0) {
          groupes.push(
            match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
          );
        }
        if (!groupes.find((x) => x.id === match.groupe_id)) {
          groupes.push(
            match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
          );
        }
        groupesMatch.push({
          id: match.id,
          groupe: match.equipes[0].groupes.find(
            (el) => el.id === match.groupe_id
          ),
          date: match.date,
          coeff: match.coeff,
          groupe_id: match.groupe_id,
          equipes: [
            {
              id: match.equipes[0].id,
              name: match.equipes[0].name,
              country: match.equipes[0].country,
              images: match.equipes[0].images,
              createdAt: match.equipes[0].createdAt,
              updatedAt: match.equipes[0].updatedAt,
            },
            {
              id: match.equipes[1].id,
              name: match.equipes[1].name,
              country: match.equipes[1].country,
              images: match.equipes[1].images,
              createdAt: match.equipes[1].createdAt,
              updatedAt: match.equipes[1].updatedAt,
            },
          ],
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        });
      });
      let formatData = [];
      groupes.map((groupe) => {
        let matchs = [];
        groupesMatch.map((match) => {
          if (groupe.id === match.groupe.id) {
            matchs.push({
              id: match.id,
              date: match.date,
              coeff: match.coeff,
              groupe_id: match.groupe_id,
              equipes: [
                {
                  id: match.equipes[0].id,
                  name: match.equipes[0].name,
                  country: match.equipes[0].country,
                  icon: match.equipes[0].icon,
                  createdAt: match.equipes[0].createdAt,
                  updatedAt: match.equipes[0].updatedAt,
                },
                {
                  id: match.equipes[1].id,
                  name: match.equipes[1].name,
                  country: match.equipes[1].country,
                  icon: match.equipes[1].icon,
                  createdAt: match.equipes[1].createdAt,
                  updatedAt: match.equipes[1].updatedAt,
                },
              ],
              createdAt: match.createdAt,
              updatedAt: match.updatedAt,
            });
          }
        });
        formatData.push({
          groupe,
          matchs,
        });
      });

      return res.status(200).send(formatData);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_COEFF_MATCH_BY_EVENT_FOR_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      let matchess = await Matchs.findAll({
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

      let matchessTest = await Matchs.findAll({
        include: [
          {
            model: Equipes,
          },
          {
            model: Groupes,
            where: { event_id },
          },
        ],
      });

      matchess = matchess.filter((el) => el.equipes.length > 0);

      // let groupesMatch = [];
      // let groupes: Groupes[] = [];
      // matchess.map((match, index) => {
      //   if (groupes.length === 0) {
      //     groupes.push(
      //       match.equipes[0].groupes.find((el) => {
      //         return el.id === match.groupe_id;
      //       })
      //     );
      //   }
      //   if (!groupes.find((x) => x.id === match.groupe_id)) {
      //     groupes.push(
      //       match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
      //     );
      //   }
      //   groupesMatch.push({
      //     id: match.id,
      //     groupe: match.equipes[0].groupes.find(
      //       (el) => el.id === match.groupe_id
      //     ),
      //     date: match.date,
      //     coeff: match.coeff,
      //     groupe_id: match.groupe_id,
      //     equipes: [
      //       // {
      //       //   id: match.equipes[0].id,
      //       //   name: match.equipes[0].name,
      //       //   country: match.equipes[0].country,
      //       //   images: match.equipes[0].images,
      //       //   createdAt: match.equipes[0].createdAt,
      //       //   updatedAt: match.equipes[0].updatedAt,
      //       // },
      //       match.equipes[0],
      //       match.equipes[1],
      //       // {
      //       //   id: match.equipes[1].id,
      //       //   name: match.equipes[1].name,
      //       //   country: match.equipes[1].country,
      //       //   images: match.equipes[1].images,
      //       //   createdAt: match.equipes[1].createdAt,
      //       //   updatedAt: match.equipes[1].updatedAt,
      //       // },
      //     ],
      //     createdAt: match.createdAt,
      //     updatedAt: match.updatedAt,
      //   });
      // });

      const groupes = await Groupes.findAll({
        where: { event_id },
      });

      let formatData = [];
      groupes.map((groupe) => {
        let matchs = [];
        matchessTest.map((match) => {
          if (groupe.id === match.groupes.id) {
            matchs.push({
              id: match.id,
              date: match.date ,
              coeff: match.coeff,
              groupe_id: match.groupe_id,
              equipes: [
                // {
                //   id: match.equipes[0].id,
                //   name: match.equipes[0].name,
                //   country: match.equipes[0].country,
                //   images: match.equipes[0].images,
                //   createdAt: match.equipes[0].createdAt,
                //   updatedAt: match.equipes[0].updatedAt,
                // },
                match.equipes[0],
                match.equipes[1],
                // {
                //   id: match.equipes[1].id,
                //   name: match.equipes[1].name,
                //   country: match.equipes[1].country,
                //   images: match.equipes[1].images,
                //   createdAt: match.equipes[1].createdAt,
                //   updatedAt: match.equipes[1].updatedAt,
                // },
              ],
              createdAt: match.createdAt,
              updatedAt: match.updatedAt,
            });
          }
        });
        formatData.push({
          groupe,
          matchs,
        });
      });

      return res.status(200).send(formatData);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_EVENT,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      // let matchess = await Matchs.findAll({
      //   include: [
      //     {
      //       model: Equipes,
      //       include: [
      //         {
      //           model: Groupes,
      //           where: { event_id },
      //         },
      //       ],
      //     },
      //   ],
      // });

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

let today = new Date();
let yesterday = new Date(today);
  
  
  
yesterday.setDate(yesterday.getDate() - 1);
console.log(yesterday.toLocaleString("sv-SE"));
      let matchess = await Matchs.findAll({
        where: {
          groupe_id: { [Op.in]: grIds },
         // date: { [Op.gt]: yesterday}
        },
        include: [
          {
            model: Equipes,
            include: [
              {
                model: Groupes,
                where: {event_id}

                
              },
            ],
          },
        ],
      });

      matchess = matchess.filter((el) => el.equipes.length > 0);

      let groupesMatch = [];
      let groupes: Groupes[] = [];
      matchess.map((match, index) => {
        if (groupes.length === 0) {
          groupes.push(
            match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
          );
        }
        if (!groupes.find((x) => x.id === match.groupe_id )) {
          groupes.push(
            match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
          );
        }
        groupesMatch.push({
          id: match.id,
          groupe: match.equipes[0].groupes.find(
            (el) => el.id === match.groupe_id
          ),
          date: match.date,
          coeff: match.coeff,
          groupe_id: match.groupe_id,
          equipes: [
            // id: match.equipes[0].id,
            // name: match.equipes[0].name,
            // country: match.equipes[0].country,
            // images: match.equipes[0].images,
            // createdAt: match.equipes[0].createdAt,
            // updatedAt: match.equipes[0].updatedAt,
            match.equipes[0],
            match.equipes[1],
            // {
            //   id: match.equipes[1].id,
            //   name: match.equipes[1].name,
            //   country: match.equipes[1].country,
            //   images: match.equipes[1].images,
            //   createdAt: match.equipes[1].createdAt,
            //   updatedAt: match.equipes[1].updatedAt,
            // },
          ],
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        });
      });
      let formatData = [];
      groupes.map((groupe) => {
        let matchs = [];
        groupesMatch.map((match) => {
          if (groupe.id === match.groupe.id) {
            matchs.push({
              id: match.id,
              date: match.date,
              coeff: match.coeff,
              groupe_id: match.groupe_id,
              equipes: [
                // {
                //   id: match.equipes[0].id,
                //   name: match.equipes[0].name,
                //   country: match.equipes[0].country,
                //   images: match.equipes[0].images,
                //   createdAt: match.equipes[0].createdAt,
                //   updatedAt: match.equipes[0].updatedAt,
                // },
                match.equipes[0],
                match.equipes[1],
                // {
                //   id: match.equipes[1].id,
                //   name: match.equipes[1].name,
                //   country: match.equipes[1].country,
                //   images: match.equipes[1].images,
                //   createdAt: match.equipes[1].createdAt,
                //   updatedAt: match.equipes[1].updatedAt,
                // },
              ],
              createdAt: match.createdAt,
              updatedAt: match.updatedAt,
            });
          }
        });

        formatData.push({
          groupe,
          matchs,
        });
      });

      return res.status(200).send(formatData);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_EVENT_FOR_ADD_DATES,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const matchess = await Matchs.findAll({
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

      let groupesMatch = [];
      let groupes: Groupes[] = [];
      matchess.map((match) => {
        if (!match.date) {
          if (groupes.length === 0) {
            groupes.push(match.equipes[0].groupes[0]);
          }
          if (!groupes.find((x) => x.id === match.equipes[0].groupes[0].id)) {
            groupes.push(match.equipes[0].groupes[0]);
          }
          groupesMatch.push({
            id: match.id,
            groupe: match.equipes[0].groupes[0],
            date: match.date,
            groupe_id: match.groupe_id,
            equipes: [
              {
                model: Groupes,
                where: { event_id },
              },
              {
                id: match.equipes[1].id,
                name: match.equipes[1].name,
                country: match.equipes[1].country,
                images: match.equipes[1].images,
                createdAt: match.equipes[1].createdAt,
                updatedAt: match.equipes[1].updatedAt,
              },
            ],
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
          });
        }
      });
      let formatData = [];
      groupes.map((groupe) => {
        let matchs = [];
        groupesMatch.map((match) => {
          if (groupe.id === match.groupe.id) {
            matchs.push({
              id: match.id,
              date: match.date,
              groupe_id: match.groupe_id,
              equipes: [
                {
                  id: match.equipes[0].id,
                  name: match.equipes[0].name,
                  country: match.equipes[0].country,
                  icon: match.equipes[0].icon,
                  createdAt: match.equipes[0].createdAt,
                  updatedAt: match.equipes[0].updatedAt,
                },
                {
                  id: match.equipes[1].id,
                  name: match.equipes[1].name,
                  country: match.equipes[1].country,
                  icon: match.equipes[1].icon,
                  createdAt: match.equipes[1].createdAt,
                  updatedAt: match.equipes[1].updatedAt,
                },
              ],
              createdAt: match.createdAt,
              updatedAt: match.updatedAt,
            });
          }
        });
        formatData.push({
          groupe,
          matchs,
        });
      });

      return res.status(200).send(formatData);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_EVENT_FOR_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const { company_id, id } = res.locals.currentUser as User;
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

      // let matches = await Matchs.findAll({
      //   include: [
      //     {
      //       model: Equipes,
      //       include: [
      //         {
      //           model: Groupes,
      //           where: { event_id },
      //         },
      //       ],
      //     },
      //   ],
      // });

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
              },
            ],
          },
        ],
      });

      matches = matches.filter((el) => el.equipes.length > 0);
      let groupesMatch = [];
      let groupes: Groupes[] = [];
      matches.map(async (match) => {
        const matchDate = new Date(match.date);
        matchDate.setHours(matchDate.getHours() + 12);
        if (new Date() < matchDate && match.date) {
          if (groupes.length === 0) {
            groupes.push(
              match.equipes[0].groupes.find((el) => {
                return el.id === match.groupe_id;
              })
            );
          }
          if (!groupes.find((x) => x.id === match.groupe_id)) {
            groupes.push(
              match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
            );
          }
          groupesMatch.push({
            id: match.id,
            groupe: match.equipes[0].groupes.find(
              (el) => el.id === match.groupe_id
            ),
            date: match.date,
            groupe_id: match.groupe_id,
            equipes: [
              // {
              //   id: match.equipes[0].id,
              //   name: match.equipes[0].name,
              //   country: match.equipes[0].country,
              //   images: match.equipes[0].images,
              //   createdAt: match.equipes[0].createdAt,
              //   updatedAt: match.equipes[0].updatedAt,
              // },
              match.equipes[0],
              match.equipes[1],
              // {
              //   id: match.equipes[1].id,
              //   name: match.equipes[1].name,
              //   country: match.equipes[1].country,
              //   images: match.equipes[1].images,
              //   createdAt: match.equipes[1].createdAt,
              //   updatedAt: match.equipes[1].updatedAt,
              // },
            ],
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
          });
        }
      });

      const pronostics = await Pronostics.findAll({
        where: {
          employee_id: id,
        },
        include: [
          {
            model: User,
            include: [
              {
                model: Events,
                where: { id: event_id },
              },
            ],
          },
        ],
      });

      let formatData = [];
      groupes.map(async (groupe, index) => {
        let matchs = [];
        if (groupesMatch.length > 0) {
          groupesMatch.map(async (match) => {
            if (
              groupe.id === match.groupe.id &&
              !pronostics.find((pronostic) => pronostic.match_id === match.id)
            ) {
              matchs.push({
                id: match.id,
                date: match.date,
                groupe_id: match.groupe_id,
                equipes: [
                  // {
                  //   id: match.equipes[0].id,
                  //   name: match.equipes[0].name,
                  //   country: match.equipes[0].country,
                  //   images: match.equipes[0].images,
                  //   createdAt: match.equipes[0].createdAt,
                  //   updatedAt: match.equipes[0].updatedAt,
                  // },
                  match.equipes[0],
                  match.equipes[1],
                  // {
                  //   id: match.equipes[1].id,
                  //   name: match.equipes[1].name,
                  //   country: match.equipes[1].country,
                  //   images: match.equipes[1].images,
                  //   createdAt: match.equipes[1].createdAt,
                  //   updatedAt: match.equipes[1].updatedAt,
                  // },
                ],
                createdAt: match.createdAt,
                updatedAt: match.updatedAt,
              });
            }
          });
          if (matchs.length > 0) {
            matchs.sort((x, y) => x.date - y.date);
            formatData.push({
              groupe,
              matchs,
            });
          }
        }
        if (groupes.length === index + 1) {
          return res.status(200).send(formatData);
        }
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_EVENT_FOR_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const { id } = res.locals.currentUser as User;
      const userEvent = await UserEvents.findOne({
        where: { user_id: id, event_id },
      });
      if (!userEvent) {
        return res
          .status(400)
          .send({ success: false, message: MSG.EVENT_NOT_BUYED });
      }

      let matchess = await Matchs.findAll({
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
      matchess = matchess.filter((el) => el.equipes.length > 0);
      let groupesMatch = [];
      let groupes: Groupes[] = [];
      matchess.map((match) => {
        if (groupes.length === 0) {
          groupes.push(
            match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
          );
        }
        if (!groupes.find((x) => x.id === match.groupe_id)) {
          groupes.push(
            match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
          );
        }
        groupesMatch.push({
          id: match.id,
          groupe: match.equipes[0].groupes.find(
            (el) => el.id === match.groupe_id
          ),
          date: match.date,
          groupe_id: match.groupe_id,
          equipes: [
            {
              id: match.equipes[0].id,
              name: match.equipes[0].name,
              country: match.equipes[0].country,
              images: match.equipes[0].images,
              createdAt: match.equipes[0].createdAt,
              updatedAt: match.equipes[0].updatedAt,
            },
            {
              id: match.equipes[1].id,
              name: match.equipes[1].name,
              country: match.equipes[1].country,
              images: match.equipes[1].images,
              createdAt: match.equipes[1].createdAt,
              updatedAt: match.equipes[1].updatedAt,
            },
          ],
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        });
      });
      let formatData = [];
      groupes.map((groupe) => {
        let matchs = [];
        groupesMatch.map((match) => {
          if (groupe.id === match.groupe.id) {
            matchs.push({
              id: match.id,
              date: match.date,
              groupe_id: match.groupe_id,
              equipes: [
                {
                  id: match.equipes[0].id,
                  name: match.equipes[0].name,
                  country: match.equipes[0].country,
                  images: match.equipes[0].images,
                  createdAt: match.equipes[0].createdAt,
                  updatedAt: match.equipes[0].updatedAt,
                },
                {
                  id: match.equipes[1].id,
                  name: match.equipes[1].name,
                  country: match.equipes[1].country,
                  images: match.equipes[1].images,
                  createdAt: match.equipes[1].createdAt,
                  updatedAt: match.equipes[1].updatedAt,
                },
              ],
              createdAt: match.createdAt,
              updatedAt: match.updatedAt,
            });
          }
        });
        matchs.sort((x, y) => x.date - y.date);
        formatData.push({
          groupe,
          matchs,
        });
      });

      return res.status(200).send(formatData);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_ID_FOR_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { match_id } = req.body;
      if (!match_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
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

      const partner = await User.findOne({
        where: {
          company_id,
          role: "partner",
        },
      });

      const event = await UserEvents.findOne({
        where: {
          user_id: partner.id,
          event_id: match.groupes.event_id,
        },
      });

      if (!event) {
        return res
          .status(400)
          .send({ success: false, message: MSG.EVENT_NOT_BUYED });
      }

      return res.status(200).send(match);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.GET_MATCH_BY_ID_FOR_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { match_id } = req.body;
      if (!match_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const match = await Matchs.findOne({
        where: { id: match_id },
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

      if (!match) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_NOTFIND });
      }

      return res.status(200).send(match);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.ADD_DATE_TO_MATCHS,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { matchsDates } = req.body;
      if (matchsDates.length === 0) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      matchsDates.map(async (match, index) => {
        await Matchs.update(
          {
            date: match.date,
          },
          {
            where: { id: match.id },
          }
        );
        if (matchsDates.length === index + 1) {
          return res.status(200).send({ message: MSG.UPLOAD_SUCSSES });
        }
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.UPDATE_DATE_MATCH,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { matchId, date } = req.body;
      if (!matchId || !date) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      await Matchs.update(
        {
          date,
        },
        {
          where: { id: matchId },
        }
      );
      return res.status(200).send({ message: MSG.UPDATE_SUCSSES });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.post(
  URLs.UPDATE_COEFF_MATCH,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { matchId, coeff } = req.body;
      if (!matchId || !coeff) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const score = await Score.findOne({
        where: { match_id: matchId },
      });

      if (score) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_HAVE_SCORE });
      }

      await Matchs.update(
        {
          coeff,
        },
        {
          where: { id: matchId },
        }
      );
      return res.status(200).send({ message: MSG.UPDATE_SUCSSES });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

////// get all match by events///////

MatchRoutes.post(
  URLs.GET_ALL_MATCH_BY_EVENT_FOR_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id, dateStart, dateEnd } = req.body;
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
      // const today = new Date();
      // const yesterday = new Date(today);
      // yesterday.setDate(yesterday.getDate() - 1);
      // console.log(yesterday.toDateString());
      const listMatch = await Matchs.findAll({
        where: {
          // date:yesterday ,
          
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

      let finalData = [];
      if (dateEnd && !dateStart) {
        finalData = listMatch.filter(
          (el) => el.date !== null && new Date(el.date) <= new Date(dateEnd)
        );
      }
      if (!dateEnd && dateStart) {
        finalData = listMatch.filter(
          (el) => el.date !== null && new Date(el.date) >= new Date(dateStart)
        );
      }

      if (dateEnd && dateStart) {
        finalData = listMatch.filter(
          (el) =>
            el.date !== null &&
            new Date(el.date) >= new Date(dateStart) &&
            new Date(el.date) <= new Date(dateEnd)
        );
      }
      if (finalData.length === 0) {
        return res.status(200).send(listMatch);
      } else return res.status(200).send(finalData);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/****** GET MATCHES BY IDS ******/

MatchRoutes.post(
  URLs.GET_MATCHS_BY_IDS,
  auth,
  isActive,
  isEmployee,
  async (req, res) => {
    try {
      let { ids } = req.body;
      let listMatchs: Matchs[] = [];
      if (!ids) return res.status(400).send({ message: MSG.DATA_MISSING });
      const promise = new Promise<void>(async (resolve) => {
        ids.forEach(async (id: number, index: number) => {
          let match: Matchs | null = await Matchs.findOne({
            include: [Equipes],
            where: { id: id },
          });
          listMatchs.push(match);
          if (ids.length === index + 1) {
            resolve();
          }
        });
      });
      promise.then(async () => {
        return res.status(200).send(listMatchs);
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

//////////////////////////   Delete match   ///////////

MatchRoutes.post(
  URLs.DELETE_MATCH,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    const id = req.body.id;
    if (!id) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      const match: Matchs | null = await Matchs.findByPk(id);
      if (match) {
        await Matchs.destroy({ where: { id: match.id } });

        await Pronostics.destroy({ where: { match_id: match.id } });
        await Order_Match.destroy({ where: { match_id: match.id } });
        await PronosticsMatchs.destroy({ where: { match_id: match.id } });
        Score.destroy({ where: { match_id: match.id } })

          .then((deleted) => {
            return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
          })
          .catch((error) => {
            res.status(500).send({ message: MSG.SQL_ERROR });
          });
      } else {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

///////   edit match equipe //////

MatchRoutes.post(
  URLs.UPDATE_MATCH_EQUIPE,
  auth,
  isAdmin,
  isActive,

  async function (req, res) {
    try {
      const { id, listEquipes, groupe_id, event_id, coeff, date} = req.body;
      if (!id || !listEquipes || !groupe_id || !event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const match = await Matchs.findByPk(+id);
      if (match) {
        await MatchEquipes.destroy({ where: { match_id: match.id } });
      }
 
      const promise = new Promise<void>(async (resolve, reject) => {
        listEquipes.forEach(async (listEquipe, index) => {
          if (index === 0) {
         
            await Matchs.update({
              date: date,
              coeff: coeff ,
            },
            {
              where: { id },
            }
            );
            await MatchEquipes.create({
              match_id: match.id,
              equipe_id: listEquipe,
              order: true,
            });
       
          } else {
 
            await MatchEquipes.create({
              match_id: match.id,
              equipe_id: listEquipe,
              order: false,
            });
            
          }
          
          if (listEquipes.length === index + 1) resolve();
        });
      });
      promise.then(() => {
        const promise2 = new Promise<void>((resolve) => {
          listEquipes.forEach(async (listEquipe, index) => {

            const groupeEquipe = await GroupeEquipes.findOne({
              where: {
                groupe_id,
                equipe_id: listEquipe,
              },
            });
            if (!groupeEquipe) {
              await Order.create({
                groupe_id: groupe_id,
                equipe_id: listEquipe,
                event_id: event_id,
              });
              await GroupeEquipes.create({
                groupe_id,
                equipe_id: listEquipe,
              });
          
            }
            if (listEquipes.length === index + 1) resolve();
          });
          
        });

        promise2.then(() => {
          return res.status(200).send({
            message: MSG.CREATE_SUCCESUFULLY,
          });
        });
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

MatchRoutes.get(
  URLs.GET_MATCH_NOTIFICATION_BY_EVENTS_FOR_EMPLOYEE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { company_id, id } = res.locals.currentUser as User;
      const partner = await User.findOne({
        where: { company_id, role: "partner" },
      });
      // const userEvent = await UserEvents.findOne({
      //   where: { user_id: partner.id },
      // });

      const actives = await UserEvents.findAll({
        where: { user_id: partner.id },
      });

      const activeEvents = [];
      actives.map(function (activeEvent) {
        if (activeEvent.is_active) {
          activeEvents.push(activeEvent);
        }
      });

      const event_ids = activeEvents.map((el) => el.event_id);

      if (!actives) {
        return res
          .status(400)
          .send({ success: false, message: MSG.EVENT_NOT_BUYED });
      }

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

      matches = matches.filter((el) => el.equipes.length > 0);
      let groupesMatch = [];
      let groupes: Groupes[] = [];
      matches.map(async (match) => {
        const matchDate = new Date(match.date);
        matchDate.setHours(matchDate.getHours() + 1);
        if (new Date() < matchDate && match.date) {
          if (groupes.length === 0) {
            groupes.push(
              match.equipes[0].groupes.find((el) => {
                return el.id === match.groupe_id;
              })
            );
          }
          if (!groupes.find((x) => x.id === match.groupe_id)) {
            groupes.push(
              match.equipes[0].groupes.find((el) => el.id === match.groupe_id)
            );
          }
          groupesMatch.push({
            id: match.id,
            groupe: match.equipes[0].groupes.find(
              (el) => el.id === match.groupe_id
            ),
            date: match.date,
            groupe_id: match.groupe_id,
            equipes: [
              // {
              //   id: match.equipes[0].id,
              //   name: match.equipes[0].name,
              //   country: match.equipes[0].country,
              //   images: match.equipes[0].images,
              //   createdAt: match.equipes[0].createdAt,
              //   updatedAt: match.equipes[0].updatedAt,
              // },
              match.equipes[0],
              match.equipes[1],
              // {
              //   id: match.equipes[1].id,
              //   name: match.equipes[1].name,
              //   country: match.equipes[1].country,
              //   images: match.equipes[1].images,
              //   createdAt: match.equipes[1].createdAt,
              //   updatedAt: match.equipes[1].updatedAt,
              // },
            ],
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
          });
        }
      });

      const pronostics = await Pronostics.findAll({
        where: {
          employee_id: id,
        },
        include: [
          {
            model: User,
            include: [
              {
                model: Events,
              },
            ],
          },
        ],
      });

      let formatData = [];
      groupes.map(async (groupe, index) => {
        let matchs = [];
        if (groupesMatch.length > 0) {
          groupesMatch.map(async (match) => {
            if (
              groupe.id === match.groupe.id &&
              !pronostics.find((pronostic) => pronostic.match_id === match.id)
            ) {
              matchs.push({
                id: match.id,
                date: match.date,
                groupe_id: match.groupe_id,
                createdAt: match.createdAt,
                updatedAt: match.updatedAt,
              });
            }
          });
          if (matchs.length > 0) {
            matchs.sort((x, y) => x.date - y.date);
            formatData.push({
              groupe,
              matchs,
            });
          }
        }
        if (groupes.length === index + 1) {
          return res.status(200).send(formatData);
        }
      });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { MatchRoutes };
