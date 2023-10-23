import { DrawScore } from "./../sqlModels/drawScore";
import { Options } from "./../sqlModels/options";
import { TotalPronostics } from "./../sqlModels/totalPronostics";
import { PronosticsMatchs } from "./../sqlModels/pronosticsMatchs";
import { Pronostics } from "./../sqlModels/pronostic";
import express from "express";
import { MSG } from "../util/translate/fr/translateFR";
import { User } from "../sqlModels/user";
import auth from "../middlewares/auth";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import { URLs } from "../util/common";
import { Company } from "../sqlModels/company";
import isPartner from "../middlewares/partner";
import mail from "../nodeMailer/mail";
import { activationPartner, deactivatePartner } from "../nodeMailer/welcome";
import crypto from "crypto";
import * as bcrypt from "bcrypt";
import { Order } from "../sqlModels/order";
import { Draw } from "../sqlModels/draw";
import { Op } from "sequelize";

const PartnerRoutes = express.Router();

/*            ****** Get List Partners  ******      */

PartnerRoutes.get(
  URLs.GET_PARTNERS,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const listPartner: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: [Company],

        where: { role: "partner" },

        order: [["is_active", "DESC"]],
      });
      return res.status(200).send({ data: listPartner });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get Partner By Id  ******      */

PartnerRoutes.get(
  URLs.GET_PARTNER_BY_ID,
  auth,
  isAdmin,
  isActive,
  async (req, res) => {
    let id = req.query.id as string;
    if (!id)
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });

    const partner: any | null = await User.findOne({
      attributes: {
        exclude: ["password"],
      },
      raw: true,
      nest: true,
      include: [Company],
      where: { id: id, role: "partner" },
    });
    if (partner) {
      const employees: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: { company_id: id, role: "employee", is_active: true },
      });
      partner.employees = employees;
      return res.status(200).send({ data: partner });
    } else {
      return res
        .status(400)
        .send({ success: false, message: MSG.USER_NOT_FOUND });
    }
  }
);
/*            ****** Delete Partner  ******      */

// PartnerRoutes.post(
//   URLs.DELETE_PARTNER,
//   auth,
//   isAdmin,
//   isActive,
//   async function (req, res) {
//     const id = req.body.id;
//     if (!id) {
//       return res
//         .status(400)
//         .send({ success: false, message: MSG.DATA_MISSING });
//     }

//     try {
//       const user: User | null = await User.findByPk(id);
//       if (user) {
//         Company.destroy({ where: { id: user.company_id } })
//           .then((deleted) => {
//             return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
//           })
//           .catch((error) => {
//             console.log("error", error);
//             res.status(500).send({ message: MSG.SQL_ERROR });
//           });
//       } else {
//         return res
//           .status(400)
//           .send({ success: false, message: MSG.USER_NOT_FOUND });
//       }
//     } catch (error) {
//       console.log("error", error);
//       res.status(500).send({ message: MSG.SQL_ERROR });
//     }
//   }
// );

/*            ****** Edit Profile  ******      */

PartnerRoutes.put(
  URLs.UPDATE_PARTNER,
  auth,
  isActive,
  isPartner,
  async function (req, res) {
    let { id } = res.locals.currentUser as User;
    const email = req.body.email;
    const socialReason = req.body.socialReason;
    const employeeNumber = req.body.employeeNumber;
    const phone = req.body.phone;
    const photo = req.body.photo;

    if (!id || !email || !socialReason || !employeeNumber || !phone || !photo) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
    }

    try {
      const user: User | null = await User.findOne({
        where: { id: id, role: "partner", is_active: true },
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
            Company.update(
              {
                photo: photo,
                social_reason: socialReason,
                employee_number: employeeNumber,
                phone: phone,
              },
              {
                where: {
                  id: user.company_id,
                },
              }
            )
              .then((updatedCompany) => {
                if (!updatedCompany) {
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
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get Currently Partner ******      */

PartnerRoutes.get(
  URLs.GET_CURRENTLY_PARTNER,
  auth,
  isPartner,
  isActive,
  async (req, res) => {
    let { id } = res.locals.currentUser as User;
    if (!id)
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });

    const partner: any | null = await User.findOne({
      attributes: {
        exclude: ["password"],
      },
      raw: true,
      nest: true,
      include: [Company],
      where: { id: id, role: "partner" },
    });
    if (partner) {
      const employees: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: { company_id: id, role: "employee", is_active: true },
      });
      partner.employees = employees;
      return res.status(200).send({ data: partner });
    } else {
      return res
        .status(400)
        .send({ success: false, message: MSG.USER_NOT_FOUND });
    }
  }
);

PartnerRoutes.post(
  URLs.ACTIVATE_ACCOUNT_PARTNER,
  auth,
  isAdmin,
  isActive,
  async (req, res) => {
    try {
      const { id, is_active } = req.body;
      if (!id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      User.findOne({
        where: { id: id, role: "partner" },
      })
        .then(async (user) => {
          if (!user) {
            return res.status(401).send({ message: MSG.NOT_FOUND });
          } else {
            User.update(
              { is_active: is_active },
              {
                where: {
                  company_id: user.company_id,
                },
              }
            )
              .then(async (updatedUser) => {
                if (!updatedUser) {
                  return res.status(400).send({ message: MSG.UPDATED_ERROR });
                } else {
                  if (is_active) {
                    mail(
                      user.email,
                      "Votre compte est actif! ",
                      await activationPartner(user.email)
                    );
                  } else {
                    mail(
                      user.email,
                      "Votre compte est desactivé! ",
                      await deactivatePartner(user.email)
                    );
                  }
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

/*            ****** Get List Partners by events  ******      */

PartnerRoutes.get(
  URLs.GET_PARTNERS_BY_EVENTS,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      if (!event_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const listPartner: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: [Company],
        where: { role: "partner" },
      });
      return res.status(200).send({ data: listPartner });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Delete Partner  ******      */

PartnerRoutes.post(
  URLs.DELETE_PARTNER,
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
      const partner: Company | null = await Company.findByPk(id);

      if (partner) {
        const employee = await User.findAll({
          where: { company_id: id, role: "employee" },
        });
        Pronostics.destroy({
          where: { employee_id: { [Op.in]: employee.map((el) => el.id) } },
        });
        PronosticsMatchs.destroy({
          where: { employee_id: { [Op.in]: employee.map((el) => el.id) } },
        });
        TotalPronostics.destroy({
          where: { employee_id: { [Op.in]: employee.map((el) => el.id) } },
        });
        Options.destroy({
          where: { employee_id: { [Op.in]: employee.map((el) => el.id) } },
        });
        DrawScore.destroy({
          where: { employee_id: { [Op.in]: employee.map((el) => el.id) } },
        });
        Draw.destroy({
          where: { employee_id: { [Op.in]: employee.map((el) => el.id) } },
        });
        User.destroy({ where: { company_id: id, role: "employee" } });
        User.destroy({ where: { company_id: id, role: "partner" } });
        Company.destroy({ where: { id: id } })
          .then((deleted) => {
            return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
          })
          .catch((error) => {
            console.log("error", error);
            res.status(500).send({ message: MSG.SQL_ERROR });
          });
      } else {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { PartnerRoutes };
