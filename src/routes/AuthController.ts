import express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { MSG } from "../util/translate/fr/translateFR";
import { URLs } from "../util/common";
import { User } from "../sqlModels/user";
import mail from "../nodeMailer/mail";
import { welcomePartner } from "../nodeMailer/welcome";
import { Company } from "../sqlModels/company";
import auth from "../middlewares/auth";
import isAdmin from "../middlewares/admin";
import isActive from "../middlewares/active";

const AuthRoutes = express.Router();

/*            ******* LOGIN  ******      */

AuthRoutes.post(URLs.LOGIN, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).send({
        message: MSG.DATA_MISSING,
      });
    }

    User.findOne({
      where: { email: email },
    })
      .then(async (user) => {
        if (!user) {
          return res.status(401).send({ message: MSG.NOT_FOUND });
        } else {
          if (!user.is_active) {
            return res.status(401).send({ message: MSG.USER_IS_NOT_ACTIVE });
          } else {
            const result = await bcrypt.compare(password, user.password);
            if (!result) {
              console.log(password, user.password, result)
              return res.status(401).send({ message: MSG.WRONG_CREDENTIALS });
            }

            const token = jwt.sign(
              {
                id: user.id,
              },
              process.env.TOKEN_KEY,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              token,
              message: MSG.CORRECT_CREDENTIALS,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ success: false, message: MSG.SQL_ERROR });
      });
  } catch (error) {
    res.status(500).send({ success: false, message: MSG.SQL_ERROR });
  }
});

/*            ******* Register Partner  ******      */

AuthRoutes.post(URLs.REGISTER, async (req: Request, res: Response) => {
  try {
    const { email, password, socialReason, employeeNumber, phone } = req.body;
    if (!password || !email || !socialReason || !employeeNumber || !phone) {
      return res.status(400).send({
        message: MSG.DATA_MISSING,
      });
    }

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(401).send({ message: MSG.EMAIL_EXISTS });
    }
    Company.create({
      social_reason: socialReason,
      employee_number: employeeNumber,
      phone: phone,
    })
      .then((company) => {
        if (company) {
          User.create({
            email: email,
            password: bcrypt.hashSync(password, 10),
            role: "partner",
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
              res.status(500).send({ success: false, message: MSG.SQL_ERROR });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ success: false, message: MSG.SQL_ERROR });
      });
  } catch (error) {
    res.status(500).send({ success: false, message: MSG.SQL_ERROR });
  }
});

/*            ****** Activate Account  ******      */

AuthRoutes.post(
  URLs.ACTIVATE_ACCOUNT,
  auth,
  isAdmin,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }

      User.findOne({
        where: { id: id },
      })
        .then(async (user) => {
          if (!user) {
            return res.status(401).send({ message: MSG.NOT_FOUND });
          } else {
            User.update(
              { is_active: true },
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

/*            ****** Desactive Account ******      */

AuthRoutes.post(
  URLs.DESACTIVE_ACCOUNT,
  auth,
  isAdmin,
  isActive,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).send({
          message: MSG.DATA_MISSING,
        });
      }
      const user: User | null = await User.findOne({
        where: { id: id, is_active: true },
      });

      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: MSG.USER_NOT_FOUND });
      }
      await User.update(
        {
          is_active: false,
        },
        {
          where: { id: id },
        }
      );
      return res.status(200).send({
        success: true,
        message: MSG.DESACTIVE_ACCOUNT,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

AuthRoutes.post(URLs.LOGIN_DEMO, async (req: Request, res: Response) => {
  try {
    User.findOne({
      where: { email: process.env.PARTNER_EMAIL },
    })
      .then(async (user) => {
        if (!user) {
          return res.status(401).send({ message: MSG.NOT_FOUND });
        } else {
          if (!user.is_active) {
            return res.status(401).send({ message: MSG.USER_IS_NOT_ACTIVE });
          } else {
            const result = await bcrypt.compare(
              process.env.PASSWORD_PARTNER,
              user.password
            );
            if (!result) {
              return res.status(401).send({ message: MSG.WRONG_CREDENTIALS });
            }

            const token = jwt.sign(
              {
                id: user.id,
              },
              process.env.TOKEN_KEY,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              token,
              message: MSG.CORRECT_CREDENTIALS,
            });
          }
        }
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: MSG.SQL_ERROR });
      });
  } catch (error) {
    res.status(500).send({ success: false, message: MSG.SQL_ERROR });
  }
});

export { AuthRoutes };
