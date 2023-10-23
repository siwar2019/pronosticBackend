import express from "express";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import isPartner from "../middlewares/partner";
import { Categories } from "../sqlModels/categories";
import { Events } from "../sqlModels/events";
import { TotalPronostics } from "../sqlModels/totalPronostics";
import { User } from "../sqlModels/user";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
import { Op } from "sequelize";
import { UserEvents } from "../sqlModels/userEvents";
import { Groupes } from "../sqlModels/groupes";
import { Matchs } from "../sqlModels/Matchs";
import { uploads } from "../middlewares/multer";
import { Options } from "../sqlModels/options";

const EventsRoutes = express.Router();

/*            ****** Create Event  ******      */

EventsRoutes.post(
  URLs.CREATE_EVENT,
  auth,
  isActive,
  isAdmin,
  uploads,
  async function (req, res) {
    const categoryId = req.body.categoryId;
    const name = req.body.name;
    const qualificationType = req.body.qualificationType;
    const displayQualification = req.body.displayQualification;
    const image: any = req.file;
    const description = req.body.description;
    const displayOrder = req.body.displayOrder;

    const path = `${process.env.UPLOAD_EVENTS_PATH}` + image?.name;

    try {
      if (!categoryId || !name || !description) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const category: Categories | null = await Categories.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }

      Events.create({
        categorieId: categoryId,
        name: name,
        qualificationType: qualificationType,
        displayQualification: displayQualification,
        description: description,
        image: image.filename,
        is_deleted: false,
        displayOrder: displayOrder,
      })
        .then((category) => {
          if (!category) {
            return res.status(400).send({ message: MSG.CREATE_ERROR });
          } else
            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
          //  else {
          //   image.mv(path, async function (error: any) {
          //     if (error) {
          //       return res.status(400).send({ message: MSG.UPLOAD_ERROR });
          //     }
          //   });
          // }
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Actived Event  ******      */

EventsRoutes.post(
  URLs.ACTIVED_EVENT_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const userId = req.body.partnerId;
      const activedEventIds = req.body.archivedEventsIds;

      if (!userId) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const user: User | null = await User.findOne({
        where: { id: userId, is_active: true },
      });

      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }

      activedEventIds.forEach(async (id: any) => {
        await UserEvents.update(
          {
            is_active: true,
            is_calculated: true,
          },
          {
            where: { event_id: id },
          }
        );
      });

      return res.status(200).send({
        success: true,
        message: "active event",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Desactived Event  ******      */

EventsRoutes.post(
  URLs.DESACTIVED_EVENT_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const userId = req.body.partnerId;
      const archivedEventsIds = req.body.activedEventIds;

      if (!userId) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const user: User | null = await User.findOne({
        where: { id: userId, is_active: true },
      });

      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }

      archivedEventsIds.forEach(async (id: any) => {
        await UserEvents.update(
          {
            is_active: false,
            is_calculated: false,
          },
          {
            where: { event_id: id },
          }
        );
      });

      return res.status(200).send({
        success: true,
        message: "desactive event",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get List Events  ******      */

EventsRoutes.get(URLs.GET_EVENTS, auth, isActive, async function (req, res) {
  try {
    const listeEvents: Events[] = await Events.findAll({
      include: [Categories],
    });
    return res.status(200).send({ data: listeEvents });
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});
/*            ****** Get List Events by Categorie  ******      */

EventsRoutes.post(
  URLs.GET_EVENT_BY_CATEGORIE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const listeEvents: any[] = await Events.findAll({
        where: { categorieId: id },
        include: [
          {
            model: User,
            where: { company_id: company_id },
            // attributes: {
            //   exclude: ["password"],
            // },
            attributes: [],
          },
        ],
      });

      // const formatData = listeEvents.filter(
      //   (el) => el.user[0].UserEvents.is_active
      // );

      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get Event id  ******      */

EventsRoutes.get(URLs.GET_EVENT_BY_ID, auth, isActive, async (req, res) => {
  try {
    let id = req.query.id as string;

    if (!id)
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });

    const event: Events | null = await Events.findOne({
      include: [Categories],
      where: { id: id },
    });
    if (event) {
      return res.status(200).send({ success: true, data: event });
    } else {
      return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: MSG.SQL_ERROR });
  }
});

/*            ****** Delete Event  ******      */

EventsRoutes.post(
  URLs.DELETE_EVENT,
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
      const event: Events | null = await Events.findByPk(id);
      if (event) {
        Events.destroy({ where: { id: event.id } })
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
/*            ****** Edit Event  ******      */

EventsRoutes.put(
  URLs.UPDATE_EVENT,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    const id = req.body.id;
    const categoryId = req.body.categoryId;
    const name = req.body.name;
    const icon = req.body.icon;

    if (!id || !categoryId || !name || !icon) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
    }

    try {
      const event: Events | null = await Events.findOne({ where: { id: id } });
      if (!event) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
      Events.update(
        {
          categoryId: categoryId,
          name: name,
          sport_icon: icon,
        },
        {
          where: {
            id: id,
          },
        }
      )
        .then((updatedEvent) => {
          if (!updatedEvent) {
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
/*            ****** Add Event to Partner  ******      */

EventsRoutes.post(
  URLs.ADD_EVENT_TO_PARTNER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const userId = req.body.partnerId;
      const eventIds = req.body.eventIds as Array<any>;
      if (!userId || eventIds.length === 0) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const partner = await User.findOne({ where: { id: userId } });
      const employees = await User.findAll({
        where: {
          role: "employee",
          company_id: partner.company_id,
        },
      });

      const user: User | null = await User.findOne({
        where: { id: userId, role: "partner", is_active: true },
      });

      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }

      let numberOfEvents = 0;
      const promise = new Promise<void>(async (resolve, reject) => {
        eventIds.forEach(async (id, index) => {
          const event = await Events.findOne({ where: { id: id } });
          if (event) {
            numberOfEvents++;
            await user.$add("event", event);
            employees.forEach(async (employee) => {
              await TotalPronostics.create({
                point: 0,
                diff: 0,
                event_id: event.id,
                employee_id: employee.id,
              });
              await Options.create({
                super_pronostic: false,
                forgot_save: false,
                double_score: false,
                event_id: event.id,
                employee_id: employee.id,
              });
            });
          }
          if (eventIds.length === index + 1) resolve();
        });
      });
      promise.then(async () => {
        if (eventIds.length === numberOfEvents) {
          return res.status(200).send({ message: MSG.EVENTS_ADDED });
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

EventsRoutes.get(
  URLs.GET_EVENTS_BY_PARTNER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;

      const events = await Events.findAll({
        include: [
          {
            model: User,
            where: { company_id: company_id },
            attributes: [],
          },
        ],
      });

      return res.status(200).send(events);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.GET_EVENT_BY_CATEGORIE_FOR_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { id, partnerId } = req.body;

      if (!id || !partnerId) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const eventsIds = await UserEvents.findAll({
        where: { user_id: partnerId },
        attributes: ["event_id"],
      });

      const listeEvents: Events[] = await Events.findAll({
        where: {
          categorieId: id,
          id: { [Op.notIn]: eventsIds.map((event) => event.event_id) },
        },
      });

      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.GET_EVENT_FOR_ADMIN_BY_CATEGORIE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const listeEvents: Events[] = await Events.findAll({
        where: {
          categorieId: id,
        },
      });

      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.GET_EVENT_STATISTIQUE_CORRECT_SCORE_FOR_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;

      const employees = await User.findAll({
        where: {
          company_id,
          role: "employee",
        },
      });

      const events = await Events.findAll({
        include: [
          {
            model: User,
            where: { company_id: company_id },
            attributes: [],
          },
          {
            model: Groupes,
          },
        ],
      });
      let eventData = [];
      const promise = new Promise<void>(async (resolve) => {
        events.map((event, index) => {
          let groupesData = [];
          const promise2 = new Promise<void>(async (resolve) => {
            if (event.groupes.length > 0) {
              event.groupes.forEach(async (groupe, indexG) => {
                const matchs = await Matchs.findAll({
                  where: {
                    groupe_id: groupe.id,
                  },
                });
                matchs.forEach((match) => {
                  groupesData.push(match);
                });

                console.log(`groupe ${indexG}`);
                console.log(groupesData.length);
                if (event.groupes.length === indexG + 1) resolve();
              });
            } else {
              resolve();
            }
          });
          promise2.then(() => {
            eventData.push({ event, groupesData });
            console.log(`event ${event.id}`);
            if (events.length === index + 1) resolve();
          });
        });
      });
      promise.then(() => {
        return res.status(200).send(eventData);
      });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.GET_EVENT_BY_CATEGORIE_FOR_PARTNER_BY_ADMIN,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { partner_id, categorie_id } = req.body;

      if (!partner_id || !categorie_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const partner = await User.findOne({
        where: { id: partner_id },
      });

      const listeEvents: Events[] = await Events.findAll({
        where: { categorieId: categorie_id },
        include: [
          {
            model: User,
            where: { company_id: partner.company_id },
            attributes: [],
          },
        ],
      });
      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

//////// get events by categorie for admin statistique employee /////

EventsRoutes.post(
  URLs.GET_PARTNER_BY_EVENTS_FOR_ADMIN,
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

      const partners = await User.findAll({
        include: [
          {
            model: Events,
            where: { id: event_id },
            attributes: [],
          },
        ],
      });

      return res.status(200).send(partners);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.SWITCH_ACTIVE_EVENT_FOR_PARTNER,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { event_id, is_calculated } = req.body;
      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const events = await UserEvents.findAll({
        where: {
          user_id: id,
          is_calculated: true,
        },
      });

      if (
        events.length > 1 ||
        (events.length === 1 && is_calculated === true)
      ) {
        // let accumulator = [];
        // events.forEach((el) => {
        //   if (el.is_hidden) accumulator.push[el.id];
        // });
        // if (accumulator.length === 1) {
        //   console.log("object");
        //   return res.status(400).send({
        //     message: MSG.MUST_HAVE_ONE_EVENT,
        //   });
        // } else {
        const eventSelected = await UserEvents.update(
          {
            is_calculated: is_calculated,
          },
          {
            where: {
              event_id,
              user_id: id,
            },
          }
        );

        return res.status(200).send({ data: eventSelected });
      }
      // }
      if (events.length === 1 && is_calculated === false) {
        const eventsSelected: Events[] = await Events.findAll({
          include: [
            {
              model: Categories,
            },
            {
              model: User,
              where: { id },
              attributes: { exclude: ["password"] },
            },
          ],
        });

        return res.status(400).send({
          message: MSG.MUST_HAVE_ONE_EVENT,
          eventsSelected,
        });
      }
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
//////// get partner events /////

EventsRoutes.post(
  URLs.GET_PARTNER_EVENT,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const listeUserEvents: UserEvents[] = await UserEvents.findAll({
        where: {
          user_id: id,
        },
        attributes: [
          "displayQualification",
          ["user_id", "partnerId"],
          ["event_id", "eventId"],
          ["is_active", "isActive"],
        ],
      });

      return res.status(200).send(listeUserEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
/*            ****** Get List Events by Categorie for admin  ******      */

EventsRoutes.post(
  URLs.GET_EVENT_BY_CATEGORIE_ADMIN,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { id, company_id } = req.body;
      if (!id || !company_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const listeEvents: Events[] = await Events.findAll({
        where: { categorieId: id },
        include: [
          {
            model: User,
            where: { company_id: company_id },
            attributes: [],
          },
        ],
      });
      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Delete Event partner ******      */

EventsRoutes.post(
  URLs.DELETE_PARTNER_EVENT,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const { company_id } = req.body;
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const event: Events | null = await Events.findByPk(id);

      if (event) {
        Events.destroy({ where: { id: event.id } });
        // .then((deleted) => {
        return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get List   Active Events  ******      */

EventsRoutes.get(
  URLs.GET_ACTIVE_EVENTS_FOR_PARTNER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const eventsIds = await UserEvents.findAll({
        where: { is_active: false },
      });

      const listeEvents: Events[] = await Events.findAll({
        where: {
          id: { [Op.notIn]: eventsIds.map((event) => event.event_id) },
        },
        include: [
          {
            model: Categories,
          },
          {
            model: User,
            where: { id },
            attributes: { exclude: ["password"] },
          },
        ],
      });

      return res.status(200).send({ data: listeEvents });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get List   Active Events  ******      */

EventsRoutes.post(
  URLs.ACTIVE_DESACTIVE_QUALIFICATION_FOR_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    try {
      const userId = req.body.partnerId;
      const eventId = req.body.eventId;
      const qualification = req.body.displayQualification;

      if (!userId) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const user: User | null = await User.findOne({
        where: { id: userId, is_active: true },
      });

      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }

      await UserEvents.update(
        {
          displayQualification: qualification,
        },
        {
          where: { event_id: eventId, user_id: userId },
        }
      );
      return res.status(200).send("Update with success");
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get Event by id for employee ******      */

EventsRoutes.post(
  URLs.GET_EVENT_BY_ID_FOR_EMPLOYEE,
  auth,
  isActive,
  async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const event = await Events.findOne({
        where: {
          id,
        },
      });
      if (event) {
        return res.status(200).send(event);
      } else {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.ARCHIVED_EVENT,
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
      const event = await Events.findOne({
        where: {
          id: event_id,
        },
      });

      if (!event) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
      if (event.is_deleted) {
        await Events.update(
          {
            is_deleted: false,
          },
          {
            where: { id: event_id },
          }
        );
        await UserEvents.update(
          {
            is_active: false,
          },
          {
            where: { event_id: event_id },
          }
        );
      } else if (!event.is_deleted)
        await Events.update(
          {
            is_deleted: true,
          },
          {
            where: { id: event_id },
          }
        );

      return res.status(200).send({
        success: true,
        message: "Update with success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.GET_ACTIVE_EVENT_BY_CATEGORIE_FOR_EMPLOYEE,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const eventsIds = await UserEvents.findAll({
        where: { is_active: false },
      });

      const listeEvents: Events[] = await Events.findAll({
        where: {
          categorieId: id,
          id: { [Op.notIn]: eventsIds.map((event) => event.event_id) },
        },
        include: [
          {
            model: User,
            where: { company_id: company_id },
            attributes: [],
          },
        ],
      });

      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.get(
  URLs.GET_CALCULATED_EVENTS_FOR_PARTNER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const eventsIds = await UserEvents.findAll({
        where: { is_calculated: false },
      });

      const listeEvents: Events[] = await Events.findAll({
        where: {
          id: { [Op.notIn]: eventsIds.map((event) => event.event_id) },
        },
        include: [
          {
            model: Categories,
          },
          {
            model: User,
            where: { id },
            attributes: { exclude: ["password"] },
          },
        ],
      });

      return res.status(200).send({ data: listeEvents });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.SWITCH_HIDDEN_EVENT_FOR_PARTNER,
  auth,
  isPartner,
  isActive,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { event_id, is_hidden } = req.body;
      if (!event_id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const events = await UserEvents.findAll({
        where: {
          user_id: id,
          is_hidden: true,
        },
      });

      if (events.length > 1 || (events.length === 1 && is_hidden === true)) {
        const eventSelected = await UserEvents.update(
          {
            is_hidden: is_hidden,
          },
          {
            where: {
              event_id,
              user_id: id,
            },
          }
        );

        return res.status(200).send({ data: eventSelected });
      }
      if (events.length === 1 && is_hidden === false) {
        const listeEvents: Events[] = await Events.findAll({
          include: [
            {
              model: Categories,
            },
            {
              model: User,
              where: { id },
              attributes: { exclude: ["password"] },
            },
          ],
        });

        return res.status(400).send({
          message: MSG.MUST_HAVE_ONE_EVENT,
          eventsSelected: listeEvents,
        });
      }
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.get(
  URLs.GET_ALL_PARTNERS_EVENTS,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      let partnersEvents: UserEvents[] = await UserEvents.findAll({
        attributes: {
          exclude: [
            "displayQualification",
            "is_active",
            "is_calculated",
            "is_hidden",
            "createdAt",
            "updatedAt",
          ],
        },
      });
      return res.status(200).send(partnersEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

EventsRoutes.post(
  URLs.GET_EVENT_QUALIFICATION_FOR_ADMIN_BY_CATEGORIE,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const listeEvents: Events[] = await Events.findAll({
        where: {
          categorieId: id,
          displayQualification: true,
          is_deleted: false,
        },
      });

      return res.status(200).send(listeEvents);
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { EventsRoutes };
