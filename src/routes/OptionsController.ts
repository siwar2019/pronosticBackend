import express from "express";
import isActive from "../middlewares/active";
import auth from "../middlewares/auth";
import { Options } from "../sqlModels/options";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
import isEmployee from "../middlewares/employee";
import { User } from "../sqlModels/user";
import { Matchs } from "../sqlModels/Matchs";
import { Pronostics } from "../sqlModels/pronostic";
import { addHours, eleminateHours } from "../util/hours";
import { pronosticsHistory } from "../sqlModels/pronosticHistory";

const OptionsRoutes = express.Router();

/*            ****** Get Employee Option  ******      */

OptionsRoutes.post(
  URLs.GET_EMPLOYEE_OPTIONS,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    const eventId = req.body.event_id;
    const { id } = res.locals.currentUser as User;

    if (!eventId) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      const EmployeeOption = await Options.findOne({
        where: { event_id: eventId, employee_id: id },
        attributes: [
          "super_pronostic",
          "use_date_super",
          "super_match_id",
          "forgot_save",
          "use_date_forgot",
          "forgot_match_id",
          "double_score",
          "use_date_double",
          "double_match_id",
        ],
      });
      return res.status(200).send({ data: EmployeeOption });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*      ***  CREATE PRONOSTIC WITH SUPER PRONOSTIC ***      */
OptionsRoutes.post(
  URLs.CREATE_PRONOSTIC_SUPER_PRONOSTIC,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      const superDate = new Date(matchDate);
      const superHour = addHours(superDate, 1, 30);

      if (!(currentTime < superHour && currentTime > matchDate)) {
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

      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.super_pronostic) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }

      await Pronostics.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
      });
      await Options.update(
        {
          super_pronostic: true,
          use_date_super: currentTime,
          super_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "create",
        options: "super_pronostic",
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

/*      ***  CREATE PRONOSTIC WITH FORGOT SAVE ***      */
OptionsRoutes.post(
  URLs.CREATE_PRONOSTIC_FORGOT_SAVE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      const date = new Date(matchDate);
      const lessThanHour = eleminateHours(date, 1, 0);

      if (!(currentTime < matchDate && currentTime > lessThanHour)) {
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

      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.forgot_save) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }

      await Pronostics.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
      });
      await Options.update(
        {
          forgot_save: true,
          use_date_forgot: currentTime,
          forgot_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "create",
        options: "forgot_save",
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

/*      ***  CREATE PRONOSTIC WITH DOUBLE SCORE ***      */
OptionsRoutes.post(
  URLs.CREATE_PRONOSTIC_DOUBLE_SCORE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      matchDate.setHours(matchDate.getHours() - 1);

      if (currentTime >= matchDate) {
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

      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.double_score) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }

      await Pronostics.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        score_duplicate: 2,
        match_id,
        employee_id: id,
      });
      await Options.update(
        {
          double_score: true,
          use_date_double: currentTime,
          double_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "create",
        options: "double_score",
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

/****** Update with Super Pronostic  ******/

OptionsRoutes.post(
  URLs.UPDATE_PRONOSTIC_SUPER_PRONOSTIC,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      const superDate = new Date(matchDate);
      const superHour = addHours(superDate, 1, 30);

      if (!(currentTime < superHour && currentTime > matchDate)) {
        return res
          .status(400)
          .send({ success: false, message: MSG.YOU_CANT_PREDICTED });
      }
      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.super_pronostic) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }
      const EmployeeOptions = await Options.findOne({
        where: { employee_id: id, double_match_id: match_id },
        attributes: ["double_score"],
      });

      await Pronostics.update(
        {
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
        },
        {
          where: { match_id, employee_id: id },
        }
      );
      await Options.update(
        {
          super_pronostic: true,
          use_date_super: currentTime,
          super_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      if (EmployeeOptions?.double_score)
        await pronosticsHistory.create({
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
          match_id,
          employee_id: id,
          status: "update",
          options: "double_score&super_pronostic",
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
          options: "super_pronostic",
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

/****** Update Unused Double Joker  ******/

OptionsRoutes.post(
  URLs.UPDATE_UNUSED_DOUBLE_SCORE_JOKER,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { match_id, event_id } = req.body;
      if (!match_id || !event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const match = await Matchs.findOne({ where: { id: match_id } });
      if (!match) {
        return res
          .status(400)
          .send({ success: false, message: MSG.MATCH_NOTFIND });
      }

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      matchDate.setHours(matchDate.getHours() - 1);

      if (currentTime >= matchDate) {
        return res
          .status(400)
          .send({ success: false, message: MSG.YOU_CANT_UPDATE });
      }
      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (!options.double_score) {
        return res.status(400).send({
          message: MSG.NOT_FOUND,
        });
      }
      let pronostic = await Pronostics.findOne({
        where: { match_id: match_id, employee_id: id },
        attributes: ["equipe1", "equipe2"],
      });

      await Pronostics.update(
        {
          score_duplicate: 1,
        },
        {
          where: { match_id: match_id, employee_id: id },
        }
      );
      await Options.update(
        {
          double_score: false,
          use_date_double: null,
          double_match_id: null,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(pronostic.equipe1),
        equipe2: parseInt(pronostic.equipe2),
        match_id,
        employee_id: id,
        status: "update",
      });

      return res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (err) {
      console.log("err", err);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/****** Update with double score  ******/

OptionsRoutes.post(
  URLs.UPDATE_PRONOSTIC_DOUBLE_SCORE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      matchDate.setHours(matchDate.getHours() - 1);

      if (currentTime >= matchDate) {
        return res
          .status(400)
          .send({ success: false, message: MSG.YOU_CANT_PREDICTED });
      }
      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.double_score) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }
      await Pronostics.update(
        {
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
          score_duplicate: 2,
        },
        {
          where: { match_id, employee_id: id },
        }
      );
      await Options.update(
        {
          double_score: true,
          use_date_double: currentTime,
          double_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "update",
        options: "double_score",
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

/*      ***  CREATE PRONOSTIC WITH DOUBLE SCORE & FORGOT SAVE ***      */
OptionsRoutes.post(
  URLs.CREATE_PRONOSTIC_DOUBLE_SCORE_FORGOT_SAVE,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      const date = new Date(matchDate);
      const lessThanHour = eleminateHours(date, 1, 0);

      if (!(currentTime < matchDate && currentTime > lessThanHour)) {
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

      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.double_score || options.forgot_save) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }

      await Pronostics.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        score_duplicate: 2,
        match_id,
        employee_id: id,
      });
      await Options.update(
        {
          double_score: true,
          use_date_double: currentTime,
          double_match_id: match_id,
          forgot_save: true,
          use_date_forgot: currentTime,
          forgot_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "create",
        options: "double_score&forgot_save",
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

/*      ***  CREATE PRONOSTIC WITH SUPER PRONOSTIC & DOUBLE SCORE***      */
OptionsRoutes.post(
  URLs.CREATE_PRONOSTIC_DOUBLE_SCORE_SUPER,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      const superDate = new Date(matchDate);
      const superHour = addHours(superDate, 1, 30);

      if (!(currentTime < superHour && currentTime > matchDate)) {
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

      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.super_pronostic || options.double_score) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }

      await Pronostics.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        score_duplicate: 2,
        match_id,
        employee_id: id,
      });
      await Options.update(
        {
          super_pronostic: true,
          use_date_super: currentTime,
          super_match_id: match_id,
          double_score: true,
          use_date_double: currentTime,
          double_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "create",
        options: "double_score&super_pronostic",
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

/****** Update with Super Pronostic  & Double Score ******/

OptionsRoutes.post(
  URLs.UPDATE_PRONOSTIC_DOUBLE_SCORE_SUPER_PRONOSTIC,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const { equipe1, equipe2, match_id, event_id } = req.body;
      if (!match_id || !equipe1 || !equipe2 || !event_id) {
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

      const currentTime = new Date();
      const matchDate = new Date(match.date);
      const superDate = new Date(matchDate);
      const superHour = addHours(superDate, 1, 30);

      if (!(currentTime < superHour && currentTime > matchDate)) {
        return res
          .status(400)
          .send({ success: false, message: MSG.YOU_CANT_PREDICTED });
      }
      const options = await Options.findOne({
        where: { event_id: event_id, employee_id: id },
      });

      if (options.double_score || options.super_pronostic) {
        return res.status(400).send({
          message: MSG.YOU_ALREADY_USE_THIS_JOKER,
        });
      }
      await Pronostics.update(
        {
          equipe1: parseInt(equipe1),
          equipe2: parseInt(equipe2),
          score_duplicate: 2,
        },
        {
          where: { match_id, employee_id: id },
        }
      );
      await Options.update(
        {
          super_pronostic: true,
          use_date_super: currentTime,
          super_match_id: match_id,
          double_score: true,
          use_date_double: currentTime,
          double_match_id: match_id,
        },
        {
          where: {
            event_id: event_id,
            employee_id: id,
          },
        }
      );
      await pronosticsHistory.create({
        equipe1: parseInt(equipe1),
        equipe2: parseInt(equipe2),
        match_id,
        employee_id: id,
        status: "update",
        options: "double_score&super_pronostic",
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

export { OptionsRoutes };
