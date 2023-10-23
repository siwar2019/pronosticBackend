import express from "express";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
import { Request, Response } from "express";
import { User } from "../sqlModels/user";
import mail from "../nodeMailer/mail";
import { welcomePartner } from "../nodeMailer/welcome";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import isCommercial from "../middlewares/commercial";
import { Company } from "../sqlModels/company";
import { userInfo } from "os";
import { commercial } from "../sqlModels/commercial";
import { settings } from "../sqlModels/settings";
import { requestCashout } from "../sqlModels/requestCashout";
import { payments } from "../sqlModels/payments";

const CommercialRoutes = express.Router();

/*            ******* add commercial by admin  ******      */

CommercialRoutes.post(
  URLs.CREATE_COMMERCIAL,
  auth,
  isAdmin,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { email, firstName, commissionRate, cashOut, phone } = req.body;
      if (!email || !firstName || !commissionRate || !cashOut || !phone) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      const password = crypto.randomBytes(8).toString("hex");
      commercial
        .create({
          firstName: firstName,
          commissionRate: commissionRate,
          cashOut: cashOut,
          phone: phone,
        })
        .then((commercial) => {
          if (commercial) {
            User.create({
              email: email,
              password: bcrypt.hashSync(password, 10),
              role: "commercial",
              commercial_id: commercial.id,
            })
              .then(async (user) => {
                if (user) {
                  mail(
                    user.email,
                    "Merci de nous avoir rejoint! ",
                    await welcomePartner(commercial.firstName)
                  );
                  return res.status(200).send({
                    message: MSG.USER_CREATED,
                  });
                }
              })
              .catch((error) => {
                res
                  .status(500)
                  .send({ success: false, message: MSG.SQL_ERROR});
              });
          }
        });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get All commercial   ******      */

CommercialRoutes.get(
  URLs.GET_ALL_COMMERCIAL,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const listCommercial = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: commercial,
          },
        ],
        where: { role: "commercial" },
      });
      return res.status(200).send({ data: listCommercial });
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** update Account commercial ******      */

CommercialRoutes.post(
  URLs.UPDATE_ACCOUNT_COMMERCIAL,
  auth,
  isAdmin,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { id, is_active } = req.body;
      if (!id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const userUpdated = await User.update(
        {
          is_active,
        },
        {
          where: { id },
        }
      );

      if (userUpdated[0] === 0) {
        return res.status(400).send({ message: MSG.UPDATED_ERROR });
      }

      res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ******* add partner by commercial ******      */

CommercialRoutes.post(
  URLs.CREATE_PARTNER_BY_COMMERCIAL,
  auth,
  isCommercial,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { id } = res.locals.currentUser as User;
      const { email, socialReason, employeeNumber, phone } = req.body;
      if (!email || !socialReason || !employeeNumber || !phone) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      Company.create({
        social_reason: socialReason,
        employee_number: employeeNumber,
        phone: phone,
      }).then((company) => {
        if (company) {
          const password = crypto.randomBytes(8).toString("hex");
          User.create({
            email: email,
            password: bcrypt.hashSync(password, 10),
            role: "partner",
            commercial_user: id,
            is_active: true,
            company_id: company.id,
          })

            .then(async (user) => {
              if (user) {
                mail(
                  user.email,
                  "Merci de nous avoir rejoint! ",
                  await welcomePartner(company.social_reason)
                );
                return res.status(200).send({
                  message: MSG.USER_CREATED,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              res.status(500).send({ success: false, message: MSG.SQL_ERROR });
            });
        }
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);
////////  get all partner by commercial /////

CommercialRoutes.get(
  URLs.GET_PARTNER_BY_COMMERCIAL,
  auth,
  isCommercial,
  isActive,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;
      const listPartner: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: [Company],
        where: { role: "partner", commercial_user: id },
      });
      return res.status(200).send({ data: listPartner });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** update Account partern by commercial  ******      */

CommercialRoutes.post(
  URLs.UPDATE_ACCOUNT_PARTNER_BY_COMMERCIAL,
  auth,
  isCommercial,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { id, is_active } = req.body;
      if (!id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const userUpdated = await User.update(
        {
          is_active,
        },
        {
          where: { id },
        }
      );

      if (userUpdated[0] === 0) {
        return res.status(400).send({ message: MSG.UPDATED_ERROR });
      }

      res.status(200).send({
        message: MSG.UPDATED_SUCCESUFULLY,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

////// calcul cashout  commercial ///////

CommercialRoutes.post(
  URLs.CALCUL_CASHOUT_COMMERCIAL,
  auth,
  isCommercial,
  isActive,

  async (req: Request, res: Response) => {
    try {
      const { company_id } = res.locals.currentUser as User;
      //   const { company_id } = req.body;
      // if (!company_id)
      //   return res
      //     .status(400)
      //     .send({ success: false, message: MSG.DATA_MISSING });

      const commercial = await User.findOne({
        where: {
          company_id,
          role: "commercial",
        },
      });

      const partnerList: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: [Company],
        where: { role: "partner", commercial_id: Company },
      });

      const employeList = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: {
          company_id,
          role: " employee",
        },
      });
      if (employeList) {
        return res.status(200).send({ data: employeList });
      }
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get Employees of commercial  ******      */

CommercialRoutes.get(
  URLs.GET_EMPLOYEE_COMMERCIAL,
  auth,
  isCommercial,
  isActive,
  async (req, res) => {
    const { id } = res.locals.currentUser as User;

    const partners = await User.findAll({
      where: { commercial_user: id },
      attributes: {
        exclude: ["password"],
      },
    });

    let formatDta = [];

    const promise = new Promise<any[]>(async (resolve) => {
      partners.forEach(async (el, index) => {
        const employees: User[] = await User.findAll({
          attributes: {
            exclude: ["password"],
          },
          where: { company_id: el.company_id, role: "employee" },
        });

        formatDta.push({
          partner: el,
          employees,
        });

        if (partners.length === index + 1) resolve(formatDta);
      });
    });

    promise.then((data) => {
      return res.status(200).send(data);
    });
  }
);

////// create settings price users by admin /////

CommercialRoutes.post(
  URLs.CREATE_SETTINGS_PRICE,
  auth,
  isAdmin,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { company_id } = res.locals.currentUser as User;
      const { prixUsers } = req.body;
      if (!prixUsers) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      settings
        .create({
          prixUsers: prixUsers,
        })
        .then((settings) => {
          if (!settings) {
            return res.status(400).send({ message: MSG.CREATE_ERROR });
          } else
            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
        });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ******  Update price users  ******      */

CommercialRoutes.post(
  URLs.UPDATE_PRICE_USER,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    // const { id } = res.locals.currentUser as User;
    const { prixUsers } = req.body;
    const id = req.body.id;

    if (!id || !prixUsers) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
    }

    try {
      const updateprice = await settings.findOne({
        where: { id: id },
      });
      if (!updateprice) {
        return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
      }
      settings
        .update(
          {
            prixUsers: prixUsers,
          },
          {
            where: {
              id: updateprice.id,
            },
          }
        )
        .then((settings) => {
          if (!settings) {
            return res.status(400).send({ message: MSG.UPDATED_ERROR });
          } else
            return res.status(200).send({
              message: MSG.UPDATED_SUCCESUFULLY,
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
/*            ****** Get price users for admin   ******      */

CommercialRoutes.get(
  URLs.GET_PRICE_USER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const priceUser = await settings.findOne({
        attributes: {
          exclude: ["password"],
        },
      });
      return res.status(200).send(priceUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

// /*            ****** demande cachout  by commercial  ******      */

CommercialRoutes.post(
  URLs.REQUEST_CHASH_OUT,
  auth,
  isCommercial,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { id } = res.locals.currentUser;
      const { MtCashout } = req.body;
      if (!MtCashout) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      requestCashout
        .create({
          MtCashout: MtCashout,
          commercial_id: id,
        })
        .then((requestCashout) => {
          if (!requestCashout) {
            return res.status(400).send({ message: MSG.CREATE_ERROR });
          } else
            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
        });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get demande cachout for admin   ******      */

CommercialRoutes.get(
  URLs.GET_REQUEST_CASHOUT,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const { id, commercial_id } = res.locals.currentUser as User;
      const requestList = await requestCashout.findAll({
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
            include: [{ model: commercial }],
          },
        ],
      });
      return res.status(200).send(requestList);
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/////// payment commercial by amin  ////////
CommercialRoutes.post(
  URLs.PAYMENT_COMMERCIAL,
  auth,
  isAdmin,
  isActive,

  async (req: Request, res: Response) => {
    try {
      const {
        id,
        name,
        dateEchance,
        numDeCheque,
        typeDePayments,
        nameCount,
        numCount,
        nameBq,
        IBAN,
        RIB,
        cachout,
        commercial_id,
      } = req.body;

      if (typeDePayments === "Chéque") {
        if (
          !name ||
          !dateEchance ||
          !numDeCheque ||
          !typeDePayments ||
          !cachout
        ) {
          return res.status(400).send({
            message: MSG.DATA_MISSING,
          });
        }

        payments
          .create({
            name: name,
            dateEchance: dateEchance,
            cachout: cachout,
            numDeCheque: numDeCheque,
            typeDePayments: "Chéque",
            commercial_id,
            request_id: id,
            // commercial_id: id,
          })
          .then(async (payments) => {
            const commercialUser = await User.findOne({
              where: { id: commercial_id },
              include: [
                {
                  model: commercial,
                },
              ],
            });

            await commercial.update(
              {
                solde:
                  Number(commercialUser.commercial.solde) - Number(cachout),
              },
              {
                where: { id: commercialUser.commercial.id },
              }
            );

            if (!payments) {
              return res.status(400).send({ message: MSG.CREATE_ERROR });
            } else
              return res.status(200).send({
                message: MSG.CREATE_SUCCESUFULLY,
              });
          });
      }

      if (typeDePayments === "Virement") {
        console.log("virement");
        if (
          !name ||
          !typeDePayments ||
          !nameCount ||
          !numCount ||
          !nameBq ||
          !IBAN ||
          !RIB ||
          !cachout
        ) {
          return res.status(400).send({
            message: MSG.DATA_MISSING,
          });
        }
        payments
          .create({
            name: name,
            nameCount: nameCount,
            numCount: numCount,
            nameBq: nameBq,
            IBAN: IBAN,
            cachout: cachout,
            RIB: RIB,

            typeDePayments: "Virement",

            commercial_id: commercial.id,
            // commercial_id: id,
          })
          .then((payments) => {
            if (!payments) {
              return res.status(400).send({ message: MSG.CREATE_ERROR });
            } else
              return res.status(200).send({
                message: MSG.CREATE_SUCCESUFULLY,
              });
          })
          .catch((error) => {
            console.log("error", error);
            return res.status(500).send({
              message: MSG.SQL_ERROR,
            });
          });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

export { CommercialRoutes };
