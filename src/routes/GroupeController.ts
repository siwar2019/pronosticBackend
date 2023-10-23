import { PronosticsMatchs } from "./../sqlModels/pronosticsMatchs";
import { Pronostics } from "./../sqlModels/pronostic";
import express from "express";
import auth from "../middlewares/auth";
import isPartner from "../middlewares/partner";
import { sequelize } from "../sequelize";
import { Events } from "../sqlModels/events";
import { Groupes } from "../sqlModels/groupes";
import { Equipes } from "../sqlModels/equipe";
import { MSG } from "../util/translate/fr/translateFR";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import { URLs } from "../util/common";
import { EquipeRoutes } from "./EquipeController";
import { GroupeEquipes } from "../sqlModels/groupeEquipes";
import { User } from "../sqlModels/user";
import { Matchs } from "../sqlModels/Matchs";
import { Score } from "../sqlModels/score";
import { Order } from "../sqlModels/order";
import { Order_Match } from "../sqlModels/order_match";
import { IGroupeOrder } from "../type/groupe";
import { MatchEquipes } from "../sqlModels/matchEquipes";
import { Op } from "sequelize";

const GroupeRoutes = express.Router();

/*            ****** Create Groupes  ******      */

GroupeRoutes.post(
  URLs.CREATE_GROUPES,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    const event_id = req.body.event_id;
    const nombreGroupe = req.body.nombreGroupe;

    try {
      if (!event_id || !nombreGroupe || !(nombreGroupe > 0)) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const event: Events | null = await Events.findOne({
        where: { id: event_id },
      });
      if (!event) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
      const alpha = Array.from(Array(26)).map((e, i) => i + 65);
      const alphabet = alpha.map((x) => String.fromCharCode(x));
      for (let index = 0; index < nombreGroupe; index++) {
        const groupe = await Groupes.create({
          event_id: event_id,
          name: "Groupe" + alphabet[index],
        });
        if (!groupe) {
          return res.status(400).send({ message: MSG.CREATE_ERROR });
        }
      }

      return res.status(200).send({
        message: MSG.CREATE_SUCCESUFULLY,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get List Groupes  ******      */

GroupeRoutes.get(URLs.GET_GROUPES, auth, isActive, async function (req, res) {
  try {
    const listeGroupes: Groupes[] = await Groupes.findAll({
      include: [Events],
    });
    return res.status(200).send(listeGroupes);
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});
/*            ****** Get List Groupes by Event  ******      */

GroupeRoutes.get(
  URLs.GET_GROUPES_BY_EVENT,
  auth,
  isActive,
  async function (req, res) {
    try {
      const id = req.query.id as string;
      const listeGroupes: Groupes[] = await Groupes.findAll({
        include: [Equipes],
        where: { event_id: id },
      });
      return res.status(200).send({ data: listeGroupes });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get groupe id  ******      */

GroupeRoutes.post(
  URLs.GET_GROUPE_BY_ID_EVENT,
  auth,
  isActive,
  async (req, res) => {
    try {
      const { event_id } = req.body;
      if (!event_id)
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });

      const groupes = await Groupes.findAll({
        include: [Events],
        where: { event_id },
      });
      if (groupes) {
        return res.status(200).send({ success: true, data: groupes });
      } else {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Delete Groupe  ******      */

GroupeRoutes.post(
  URLs.DELETE_GROUPE,
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
      const groupe: Groupes | null = await Groupes.findByPk(id);

      if (groupe) {
        const matchs = await Matchs.findAll({
          where: {
            groupe_id: groupe.id,
          },
        });
        Pronostics.destroy({
          where: { match_id: { [Op.in]: matchs.map((el) => el.id) } },
        });
        PronosticsMatchs.destroy({
          where: { match_id: { [Op.in]: matchs.map((el) => el.id) } },
        });
        Score.destroy({
          where: { match_id: { [Op.in]: matchs.map((el) => el.id) } },
        });
        Order.destroy({ where: { groupe_id: groupe.id } });
        Order_Match.destroy({ where: { groupe_id: groupe.id } });
        Matchs.destroy({ where: { groupe_id: groupe.id } });
        GroupeEquipes.destroy({ where: { groupe_id: groupe.id } });
        Groupes.destroy({ where: { id: groupe.id } })

          .then((deleted) => {
            return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ message: MSG.SQL_ERROR });
          });
      } else {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
/*            ****** Edit Groupe  ******      */

GroupeRoutes.put(
  URLs.UPDATE_GROUPE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    const id = req.body.id;
    const name = req.body.name;

    if (!id || !name) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
    }

    try {
      const groupe: Groupes | null = await Groupes.findOne({
        where: { id: id },
      });
      if (!groupe) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
      Groupes.update(
        {
          name: name,
        },
        {
          where: {
            id: id,
          },
        }
      )
        .then((updatedGroupe) => {
          if (!updatedGroupe) {
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
/*            ****** Add Equipe to Groupe  ******      */

EquipeRoutes.post(
  URLs.ADD_EQUIPE_TO_GROUPE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const groupeId = req.body.groupeId;
      const equipesIds = req.body.equipesIds as Array<any>;

      const groupe: Groupes | null = await Groupes.findOne({
        where: { id: groupeId },
      });
      if (!groupe) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }
      let numberOfEquipe = 0;
      const promise = new Promise<void>(async (resolve, reject) => {
        await equipesIds.forEach(async (id, index) => {
          const equipe = await Equipes.findOne({ where: { id: id } });
          if (equipe) {
            numberOfEquipe++;
            await groupe.$add("equipe", equipe);
          }
          if (equipesIds.length === index + 1) resolve();
        });
      });
      promise.then(async () => {
        if (equipesIds.length === numberOfEquipe) {
          return res.status(200).send({ message: MSG.GROUPES_ADDED });
        } else {
          return res.status(400).send({
            message: MSG.NOT_FOUND,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

// EquipeRoutes.post(URLs.GET_GROUPE_EQUIPE, auth, isActive, async function (req, res) {
//   try {
//     const { company_id } = res.locals.currentUser as User;
//     const { event_id } = req.body

//     if (!event_id) {
//       return res
//         .status(400)
//         .send({ success: false, message: MSG.DATA_MISSING });
//     }

//     const event = await Events.findOne({
//       include: [{
//         model: User,
//         where: { company_id }
//       }],
//       where: {
//         id: event_id
//       }
//     })

//     if (!event) {
//       return res
//         .status(400)
//         .send({ success: false, message: MSG.EVENT_NOT_BUYED });
//     }

//     const data = await Groupes.findAll({
//       where: { event_id },
//       include: [{
//         model: Equipes
//       }]
//     })
//     let matches = []
//     const promise = new Promise<void>((resolve) => {
//       data.forEach(async (groupe, index) => {
//         const matchs = await Matchs.findAll({
//           where: { groupe_id: groupe.id },
//           include: [
//             {
//               model: Equipes
//             },
//             {
//               model: Score
//             }
//           ]
//         })
//         matchs.forEach((el) => {
//           matches.push(el)
//         })
//         if (data.length === index + 1) resolve()
//       })
//     })
//     let matchesWithPoint = []
//     promise.then(() => {
//       const promise2 = new Promise<void>(resolve => {
//         matches.forEach((match, index) => {
//           if (match.score !== null) {
//             if (parseInt(match.score.equipe1) > parseInt(match.score.equipe2)) {
//               matchesWithPoint.push({
//                 id: match.id,
//                 date: match.date,
//                 time: match.time,
//                 coeff: match.coeff,
//                 groupe_id: match.groupe_id,
//                 createdAt: match.createdAt,
//                 updatedAt: match.update,
//                 equipes: [
//                   {
//                     id: match.equipes[0].id,
//                     name: match.equipes[0].name,
//                     country: match.equipes[0].country,
//                     icon: match.equipes[0].icon,
//                     point: 3,
//                     status: "W",
//                     createdAt: match.equipes[0].createdAt,
//                     updatedAt: match.equipes[0].updatedAt,
//                     MatchEquipes: {
//                       match_id: match.equipes[0].MatchEquipes.match_id,
//                       equipe_id: match.equipes[0].MatchEquipes.equipe_id,
//                       createdAt: match.equipes[0].MatchEquipes.createdAt,
//                       updatedAt: match.equipes[0].MatchEquipes.updatedAt
//                     }
//                   },
//                   {
//                     id: match.equipes[1].id,
//                     name: match.equipes[1].name,
//                     country: match.equipes[1].country,
//                     icon: match.equipes[1].icon,
//                     point: 0,
//                     status: "L",
//                     createdAt: match.equipes[1].createdAt,
//                     updatedAt: match.equipes[1].updatedAt,
//                     MatchEquipes: {
//                       match_id: match.equipes[1].MatchEquipes.match_id,
//                       equipe_id: match.equipes[1].MatchEquipes.equipe_id,
//                       createdAt: match.equipes[1].MatchEquipes.createdAt,
//                       updatedAt: match.equipes[1].MatchEquipes.updatedAt
//                     }
//                   }
//                 ],
//                 score: {
//                   id: match.score.id,
//                   equipe1: match.score.equipe1,
//                   equipe2: match.score.equipe2,
//                   match_id: match.score.match_id
//                 }
//               })
//             }

//             if (parseInt(match.score.equipe1) < parseInt(match.score.equipe2)) {
//               matchesWithPoint.push({
//                 id: match.id,
//                 date: match.date,
//                 time: match.time,
//                 coeff: match.coeff,
//                 groupe_id: match.groupe_id,
//                 createdAt: match.createdAt,
//                 updatedAt: match.update,
//                 equipes: [
//                   {
//                     id: match.equipes[0].id,
//                     name: match.equipes[0].name,
//                     country: match.equipes[0].country,
//                     icon: match.equipes[0].icon,
//                     point: 0,
//                     status: "L",
//                     createdAt: match.equipes[0].createdAt,
//                     updatedAt: match.equipes[0].updatedAt,
//                     MatchEquipes: {
//                       match_id: match.equipes[0].MatchEquipes.match_id,
//                       equipe_id: match.equipes[0].MatchEquipes.equipe_id,
//                       createdAt: match.equipes[0].MatchEquipes.createdAt,
//                       updatedAt: match.equipes[0].MatchEquipes.updatedAt
//                     }
//                   },
//                   {
//                     id: match.equipes[1].id,
//                     name: match.equipes[1].name,
//                     country: match.equipes[1].country,
//                     icon: match.equipes[1].icon,
//                     point: 3,
//                     status: "W",
//                     createdAt: match.equipes[1].createdAt,
//                     updatedAt: match.equipes[1].updatedAt,
//                     MatchEquipes: {
//                       match_id: match.equipes[1].MatchEquipes.match_id,
//                       equipe_id: match.equipes[1].MatchEquipes.equipe_id,
//                       createdAt: match.equipes[1].MatchEquipes.createdAt,
//                       updatedAt: match.equipes[1].MatchEquipes.updatedAt
//                     }
//                   }
//                 ],
//                 score: {
//                   id: match.score.id,
//                   equipe1: match.score.equipe1,
//                   equipe2: match.score.equipe2,
//                   match_id: match.score.match_id
//                 }
//               })
//             }

//             if (parseInt(match.score.equipe1) === parseInt(match.score.equipe2)) {
//               matchesWithPoint.push({
//                 id: match.id,
//                 date: match.date,
//                 time: match.time,
//                 coeff: match.coeff,
//                 groupe_id: match.groupe_id,
//                 createdAt: match.createdAt,
//                 updatedAt: match.update,
//                 equipes: [
//                   {
//                     id: match.equipes[0].id,
//                     name: match.equipes[0].name,
//                     country: match.equipes[0].country,
//                     icon: match.equipes[0].icon,
//                     point: 1,
//                     status: "D",
//                     createdAt: match.equipes[0].createdAt,
//                     updatedAt: match.equipes[0].updatedAt,
//                     MatchEquipes: {
//                       match_id: match.equipes[0].MatchEquipes.match_id,
//                       equipe_id: match.equipes[0].MatchEquipes.equipe_id,
//                       createdAt: match.equipes[0].MatchEquipes.createdAt,
//                       updatedAt: match.equipes[0].MatchEquipes.updatedAt
//                     }
//                   },
//                   {
//                     id: match.equipes[1].id,
//                     name: match.equipes[1].name,
//                     country: match.equipes[1].country,
//                     icon: match.equipes[1].icon,
//                     point: 1,
//                     status: "D",
//                     createdAt: match.equipes[1].createdAt,
//                     updatedAt: match.equipes[1].updatedAt,
//                     MatchEquipes: {
//                       match_id: match.equipes[1].MatchEquipes.match_id,
//                       equipe_id: match.equipes[1].MatchEquipes.equipe_id,
//                       createdAt: match.equipes[1].MatchEquipes.createdAt,
//                       updatedAt: match.equipes[1].MatchEquipes.updatedAt
//                     }
//                   }
//                 ],
//                 score: {
//                   id: match.score.id,
//                   equipe1: match.score.equipe1,
//                   equipe2: match.score.equipe2,
//                   match_id: match.score.match_id
//                 }
//               })
//             }
//             if (matches.length === index + 1) resolve()
//           } else {
//             matchesWithPoint.push({
//               id: match.id,
//               date: match.date,
//               time: match.time,
//               coeff: match.coeff,
//               groupe_id: match.groupe_id,
//               createdAt: match.createdAt,
//               updatedAt: match.update,
//               equipes: [
//                 {
//                   id: match.equipes[0].id,
//                   name: match.equipes[0].name,
//                   country: match.equipes[0].country,
//                   icon: match.equipes[0].icon,
//                   point: null,
//                   status: null,
//                   createdAt: match.equipes[0].createdAt,
//                   updatedAt: match.equipes[0].updatedAt,
//                   MatchEquipes: {
//                     match_id: match.equipes[0].MatchEquipes.match_id,
//                     equipe_id: match.equipes[0].MatchEquipes.equipe_id,
//                     createdAt: match.equipes[0].MatchEquipes.createdAt,
//                     updatedAt: match.equipes[0].MatchEquipes.updatedAt
//                   }
//                 },
//                 {
//                   id: match.equipes[1].id,
//                   name: match.equipes[1].name,
//                   country: match.equipes[1].country,
//                   icon: match.equipes[1].icon,
//                   point: null,
//                   status: null,
//                   createdAt: match.equipes[1].createdAt,
//                   updatedAt: match.equipes[1].updatedAt,
//                   MatchEquipes: {
//                     match_id: match.equipes[1].MatchEquipes.match_id,
//                     equipe_id: match.equipes[1].MatchEquipes.equipe_id,
//                     createdAt: match.equipes[1].MatchEquipes.createdAt,
//                     updatedAt: match.equipes[1].MatchEquipes.updatedAt
//                   }
//                 }
//               ],
//               score: null
//             })

//             if (matches.length === index + 1) resolve()
//           }

//         })
//       })
//       let formatData = []
//       promise2.then(() => {
//         const promise3 = new Promise<void>(resolve => {
//           matchesWithPoint.forEach(async (match, index) => {
//             let equipes = []
//             let groupes = []
//             const groupeEquipes = matchesWithPoint.filter(el => el.groupe_id === match.groupe_id)
//             if (formatData.length === 0 || !formatData.find(element => element.groupe_id === match.groupe_id)) {
//               const groupe = await Groupes.findOne({where: {id : match.groupe_id}})
//               if(groupes.includes(groupe))
//               groupeEquipes.forEach(el=>{
//                 if(!equipes.includes(el.equipes[0]) || !equipes.includes(el.equipes[1]))
//                 groupeEquipes.filter(equipe =>{

//                 })
//               })

//             }

//             if (matchesWithPoint.length === index + 1) resolve()
//           })
//         })
//         promise3.then(() => {
//           return res.status(200).send(formatData);
//         })

//       })

//     })

//   } catch (err) {
//     console.log(err)
//     res.status(500).send({ message: MSG.SQL_ERROR });
//   }

// })

EquipeRoutes.post(
  URLs.GET_GROUPE_EQUIPE,
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

      const event = await Events.findOne({
        include: [
          {
            model: User,
            where: { company_id },
          },
        ],
        where: {
          id: event_id,
        },
      });

      if (!event) {
        return res
          .status(400)
          .send({ success: false, message: MSG.EVENT_NOT_BUYED });
      }

      let data = (await Groupes.findAll({
        where: { event_id },
        include: [
          {
            model: Order,
            include: [
              {
                model: Equipes,
              },
            ],
          },
          {
            model: Order_Match,
          },
          {
            model: Events,
          },
        ],
      })) as unknown;
      let formatData = [];

      (data as IGroupeOrder[]).map((el) => {
        let formatOrder = [];
        el.order.forEach((od) => {
          formatOrder.push({
            id: od.id,
            mp: od.mp,
            w: od.w,
            d: od.d,
            l: od.l,
            pt: od.pt,
            but: od.but,
            o_but: od.o_but,
            groupe_id: od.groupe_id,
            equipe_id: od.equipe_id,
            event_id: od.event_id,
            createdAt: od.createdAt,
            updatedAt: od.updatedAt,
            equipes: {
              id: od.equipes.id,
              name: od.equipes.name,
              country: od.equipes.country,
              images: od.equipes.images,
              createdAt: od.equipes.createdAt,
              updatedAt: od.equipes.updatedAt,
              order_match: el.order_match.filter(
                (res) =>
                  res.order_id === od.id &&
                  res.equipe_id === od.equipe_id &&
                  res.groupe_id === od.groupe_id
              ),
            },
          });
        });
        formatData.push({
          id: el.id,
          name: el.name,
          event_id: el.event_id,
          order: formatOrder,
          events: el.events,
          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
        });
      });

      formatData.map((el) =>
        el.order.sort((x, y) => (x.pt < y.pt ? 1 : x.pt > y.pt ? -1 : 0))
      );

      return res.status(200).send(formatData);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EquipeRoutes.post(
  URLs.GET_GROUPE_EQUIPE_FOR_ADMIN,
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

      let data = (await Groupes.findAll({
        where: { event_id },
        include: [
          {
            model: Order,
            include: [
              {
                model: Equipes,
              },
            ],
          },
          {
            model: Order_Match,
          },
        ],
      })) as unknown;

      let formatData = [];

      (data as IGroupeOrder[]).map((el) => {
        let formatOrder = [];
        el.order.forEach((od) => {
          formatOrder.push({
            id: od.id,
            mp: od.mp,
            w: od.w,
            d: od.d,
            l: od.l,
            pt: od.pt,
            but: od.but,
            o_but: od.o_but,
            groupe_id: od.groupe_id,
            equipe_id: od.equipe_id,
            event_id: od.event_id,
            createdAt: od.createdAt,
            updatedAt: od.updatedAt,

            equipes: {
              id: od.equipes.id,
              name: od.equipes.name,
              country: od.equipes.country,
              images: od.equipes.images,
              createdAt: od.equipes.createdAt,
              updatedAt: od.equipes.updatedAt,
              order_match: el.order_match.filter(
                (res) =>
                  res.order_id === od.id &&
                  res.equipe_id === od.equipe_id &&
                  res.groupe_id === od.groupe_id
              ),
            },
          });
        });
        formatData.push({
          id: el.id,
          name: el.name,
          event_id: el.event_id,
          order: formatOrder,

          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
        });
      });

      formatData.map((el) =>
        el.order.sort((x, y) => (x.pt < y.pt ? 1 : x.pt > y.pt ? -1 : 0))
      );

      return res.status(200).send(formatData);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Create Groupes admin ******      */
const createMatch = async (
  equipes: any,
  groupeId: any,
  start: number,
  end: number
) => {
  for (let index = start; index < end; index++) {
    const match: any | null = await Matchs.create({ groupe_id: groupeId });
    await match.$add("equipe", equipes[start]);
    await match.$add("equipe", equipes[index + 1]);
  }
};
////// create groupe equipes manuellement ////

GroupeRoutes.post(
  URLs.CREATE_GROUPES_Admin,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id, groupeName, listEquipes } = req.body;

      if (!event_id || !groupeName || !listEquipes) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const event: Events | null = await Events.findOne({
        where: { id: event_id },
      });

      if (!event) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }

      const groupe = await Groupes.create({
        event_id: event_id,
        name: groupeName,
      });

      if (!groupe) {
        return res.status(400).send({ message: MSG.CREATE_ERROR });
      }
      let equipeIds = [];
      listEquipes.forEach((listEquipe) => {
        const equip1 = equipeIds.find((el) => listEquipe.equipe1 === el);
        if (!equip1) {
          equipeIds.push(listEquipe.equipe1);
        }
        const equip2 = equipeIds.find((el) => listEquipe.equipe2 === el);
        if (!equip2) {
          equipeIds.push(listEquipe.equipe2);
        }
      });

      const promise = new Promise<void>(async (resolve, reject) => {
        listEquipes.forEach(async (listEquipe, index) => {
          const equipe1 = await Equipes.findOne({
            where: { id: listEquipe.equipe1 },
          });
          const equipe2 = await Equipes.findOne({
            where: { id: listEquipe.equipe2 },
          });

          if (equipe1 && equipe2) {
            const match: any | null = await Matchs.create({
              groupe_id: groupe.id,
              date: new Date(listEquipe.date),
              coeff: listEquipe.coeff,
            });
            await MatchEquipes.create({
              match_id: match.id,
              equipe_id: equipe1.id,
              order: true,
            });
            await MatchEquipes.create({
              match_id: match.id,
              equipe_id: equipe2.id,
              order: false,
            });
          }

          if (listEquipes.length === index + 1) resolve();
        });
      });
      promise.then(() => {
        const promise2 = new Promise<void>((resolve) => {
          equipeIds.forEach(async (equipe, index) => {
            await GroupeEquipes.create({
              groupe_id: groupe.id,
              equipe_id: equipe,
            });
            await Order.create({
              groupe_id: groupe.id,
              equipe_id: equipe,
              event_id: event_id,
            });
            if (equipeIds.length === index + 1) resolve();
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

/////// add match by admin /////

GroupeRoutes.post(
  URLs.CREATE_MATCH_GROUPE_Admin,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { event_id, groupe_id, listEquipes } = req.body;

      if (!groupe_id || !listEquipes ) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      let equipeIds = [];
      listEquipes.forEach((listEquipe) => {
        const equip1 = equipeIds.find((el) => listEquipe.equipe1 === el);
        if (!equip1) {
          equipeIds.push(listEquipe.equipe1);
        }
        const equip2 = equipeIds.find((el) => listEquipe.equipe2 === el);
        if (!equip2) {
          equipeIds.push(listEquipe.equipe2);
        }
      });

      const promise = new Promise<void>(async (resolve, reject) => {
        listEquipes.forEach(async (listEquipe, index) => {
          const equipe1 = await Equipes.findOne({
            where: { id: listEquipe.equipe1 },
          });
          const equipe2 = await Equipes.findOne({
            where: { id: listEquipe.equipe2 },
          });
          if (equipe1 && equipe2) {
            const match: any | null = await Matchs.create({
              groupe_id: groupe_id,
              date: new Date(listEquipe.date),
              coeff: listEquipe.coeff

              
            });
            await MatchEquipes.create({
              match_id: match.id,
              equipe_id: equipe1.id,
              order: true,
            });
            await MatchEquipes.create({
              match_id: match.id,
              equipe_id: equipe2.id,
              order: false,
            });
          }
          if (listEquipes.length === index + 1) resolve();
        });
      });
      
      promise.then(() => {
        const promise2 = new Promise<void>((resolve) => {
          equipeIds.forEach(async (equipe, index) => {
            GroupeEquipes.findOne({
              where: {
                groupe_id,
                equipe_id: equipe,
              },
            }).then(async (groupeEquipe) => {
              if (!groupeEquipe) {
                await Order.create({
                  groupe_id: groupe_id,
                  equipe_id: equipe,
                  event_id: event_id,
                });
                await GroupeEquipes.create({
                  groupe_id,
                  equipe_id: equipe,
                });
              }
              if (equipeIds.length === index + 1) resolve();
            });
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
export { GroupeRoutes };
