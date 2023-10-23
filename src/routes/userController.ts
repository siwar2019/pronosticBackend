import { MSG } from "../util/translate/fr/translateFR";
import * as bcrypt from "bcrypt";
import { User } from "../sqlModels/user";
import express from "express";
import auth from "../middlewares/auth";
import isAdmin from "../middlewares/admin";
import { URLs } from "../util/common";
import isActive from "../middlewares/active";
import { Op } from "sequelize";
import { Company } from "../sqlModels/company";
import mail from "../nodeMailer/mail";
import { changementPassword } from "../nodeMailer/welcome";
import * as jwt from "jsonwebtoken";

const UserRoutes = express.Router();

/*            ****** Get List Users  ******      */

UserRoutes.get(
  URLs.GET_USERS,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const listUser: User[] = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: { [Op.or]: [{ role: "partner" }, { role: "employee" }] },
      });
      return res.status(200).send({ data: listUser });
    } catch (err) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get current User  ******      */

UserRoutes.get(
  URLs.GET_CURRENT_USER,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { id } = res.locals.currentUser as User;

      const user = await User.findOne({
        attributes: {
          exclude: ["password"],
        },
        where: { id: id },
      });
      if (!user) {
        return res.status(401).send({ message: MSG.NOT_FOUND });
      }
      return res.status(200).send(user);
    } catch (err) {
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

/*            ****** Get user By Id  ******      */

UserRoutes.get(
  URLs.GET_USER_BY_ID,
  auth,
  isAdmin,
  isActive,
  async (req, res) => {
    let id = req.query.id as string;

    if (!id)
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });

    const partner: User | null = await User.findOne({
      attributes: {
        exclude: ["password"],
      },
      where: { id: id },
    });
    if (partner) {
      return res.status(200).send({ data: partner });
    } else {
      return res
        .status(400)
        .send({ success: false, message: MSG.USER_NOT_FOUND });
    }
  }
);

/*            ****** Edit User ******      */

UserRoutes.put(
  URLs.UPDATE_USER,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    const id = req.body.id;
    const email = req.body.email;

    if (!id || !email) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      const user: User | null = await User.findOne({
        where: { id: id, is_active: true },
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

/*            ****** Edit Profile ******      */

UserRoutes.put(URLs.UPDATE_PROFILE, auth, isActive, async function (req, res) {
  const { id } = res.locals.currentUser as User;
  const email = req.body.email;

  if (!id || !email) {
    return res
      .status(400)
      .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
  }

  try {
    const user: User | null = await User.findOne({
      where: { id: id, is_active: true },
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
});
/*            ****** Delete User  ******      */

UserRoutes.post(
  URLs.DELETE_USER,
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
      const user: User | null = await User.findByPk(id);
      if (user) {
        User.destroy({ where: { id: id } })
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

/*            ****** Change PassWord  ******      */

UserRoutes.post(
  URLs.UPDATE_PASSWORD,
  auth,
  isActive,
  async function (req, res) {
    try {
      const { id, password } = res.locals.currentUser as User;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const result = await bcrypt.compare(oldPassword, password);

      if (!result) {
        return res.status(401).send({ message: MSG.WRONG_CREDENTIALS });
      }

      User.update(
        {
          password: bcrypt.hashSync(newPassword, 10),
        },
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
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);
/***************get liste events by partner Id*****************/

// UserRoutes.post(URLs.GET_PARTNER_EVENTS, async (req, res) => {
//   let Id = req.body.Id as string;

//   if (!Id)
//     return res.status(400).send({ success: false, message: MSG.DATA_MISSING });
//   const eq: User | null = await User.findByPk(Id, {
//     attributes: ["Id"],
//     include: [
//       {
//         model: Events,
//         as: "Events",
//         attributes: ["Id", "Name", "CategoryId"],
//       },
//     ],
//   });
//   if (eq) {
//     return res.status(200).json(eq);
//   } else {
//     return res
//       .status(400)
//       .send({ success: false, message: MSG.USER_NOT_FOUND });
//   }
// });
/// get events by partner////
// UserRoutes.get(
//   URLs.GET_PARTNER_EVENTS,
//   auth,
//   isPartner,
//   async function (req, res) {
//     try {
//       const { id } = res.locals.currentUser as User;
//       const listEvents = await Events.findAll({

//         include: [
//                 {
//                   model: User,
//                   as: "User",
//                   attributes: [],
//                   where: { id: id },
//                 },
//               ],

//       });
//       return res.status(200).json(listEvents);
//     } catch (err) {
//       console.log("err", err);
//       res.status(500).send({ message: MSG.SQL_ERROR });
//     }
//   }
// );

UserRoutes.post(URLs.FORGOT_PASSWORD, async function (req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: MSG.USER_NOT_FOUND });
    }
    const passwordToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.TOKEN_KEY,
      { expiresIn: `${10 * 60 * 1000}` }
    );

    await User.update(
      {
        password_token: passwordToken,
      },
      {
        where: { email },
      }
    );

    mail(
      user.email,
      "Code de changement password! ",
      await changementPassword(passwordToken)
    );

    return res.status(200).json({ message: MSG.CHECK_EMAIL });
  } catch (error) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});

UserRoutes.post(URLs.CHANGE_PASSWORD, async function (req, res) {
  try {
    const { code, newPassword } = req.body;

    if (!code || !newPassword) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    jwt.verify(code, process.env.TOKEN_KEY);

    const user = await User.findOne({ where: { password_token: code } });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: MSG.USER_NOT_FOUND });
    }

    await User.update(
      {
        password: bcrypt.hashSync(newPassword, 10),
        password_token: null,
      },
      {
        where: { password_token: code },
      }
    );

    return res.status(200).json({ message: MSG.UPDATED_SUCCESUFULLY });
  } catch (error) {
    res.status(500).send({ message: MSG.CODE_EXPIRED });
  }
});

UserRoutes.post(URLs.GET_COMPANY, auth, isActive, async function (req, res) {
  try {
    const { company_id } = res.locals.currentUser as User;

    const company = await Company.findOne({
      where: {
        id: company_id,
      },
    });

    return res.status(200).json(company);
  } catch (error) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});

UserRoutes.post(
  URLs.GET_PARTNER,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { partner_id } = req.body;
      if (!partner_id) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      const partner = await User.findOne({
        where: {
          id: partner_id,
        },
        attributes: { exclude: ["password"] },
        include: {
          model: Company,
        },
      });
      return res.status(200).json(partner);
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { UserRoutes };
