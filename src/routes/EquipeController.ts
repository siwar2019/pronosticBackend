import express from "express";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { sequelize } from "../sequelize";
import { Equipes } from "../sqlModels/equipe";
import { Groupes } from "../sqlModels/groupes";
import { GroupeEquipes } from "../sqlModels/groupeEquipes";
import { Matchs } from "../sqlModels/Matchs";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
var fs = require("fs");
import { parse } from "csv-parse";
import { MatchEquipes } from "../sqlModels/matchEquipes";
import { Sequelize } from "sequelize-typescript";
import { Order } from "../sqlModels/order";
import { uploadLogos } from "../middlewares/multer";
import { uploadsCSV } from "../middlewares/multer";

const EquipeRoutes = express.Router();

/*            ****** Upload file  ******      */

EquipeRoutes.post(
  URLs.UPLOAD_FILE,
  auth,
  isAdmin,
  isActive,
  uploadsCSV,
  async function (req, res) {
    try {
      const fileCSV: any = req.file;
      if (!fileCSV) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }

      return res.status(200).send({
        message: MSG.UPLOAD_SUCSSES,
      });
    } catch (error) {
      res.status(500).send({ message: MSG.UPLOAD_ERROR });
    }
  }
);

// EquipeRoutes.post(
//   URLs.UPLOAD_FILE,
//   auth,
//   isAdmin,
//   isActive,
//   uploads,
//   async function (req, res) {
//     const csvFile: any = req.file;
//     const path = `${process.env.UPLOAD_EVENTS_PATH}` + csvFile?.name;

//     try {
//       // const file: any = req.files.equipeListe;
//       if (!csvFile) {
//         return res
//           .status(400)
//           .send({ success: false, message: MSG.DATA_MISSING });
//       }

//       // csvFile.mv(path);
//       return res.status(200).send({
//         message: MSG.UPLOAD_SUCSSES,
//       });
//     } catch (error) {
//       res.status(500).send({ message: MSG.UPLOAD_ERROR });
//     }
//   }
// );

/*            ****** Create liste equipe  ******      */

EquipeRoutes.post(
  URLs.CREATE_EQUIPES,
  auth,
  isAdmin,
  isActive,
  async function (req, res) {
    try {
      const { event_id } = req.body;
      let groupeName = "";
      let groupeIds = [];
      let rows = [];
      fs.createReadStream("./uploads/equipeListe.csv")
        .pipe(parse({ delimiter: "," }))
        .on("data", function (row: any) {
          if (row[0] != groupeName) {
            groupeName = row[0];
            groupeIds.push(row[0]);
          }

          rows.push(row);
        })
        .on("end", function () {
          groupeIds.map((name) => {
            Groupes.create({
              name: name,
              event_id,
            }).then((groupe) => {
              rows.forEach(async (row) => {
                if (row[0] == groupe.name) {
                  await Equipes.findOne({ where: { name: row[1] } }).then(
                    async (equipeFinded) => {
                      if (!equipeFinded) {
                        const equipe = await Equipes.create({
                          name: row[1],
                          country: row[2],
                          images: row[3],
                        });
                        GroupeEquipes.create({
                          groupe_id: groupe.id,
                          equipe_id: equipe.id,
                        });
                        Order.create({
                          groupe_id: groupe.id,
                          equipe_id: equipe.id,
                          event_id: event_id,
                        });
                      }
                      if (equipeFinded) {
                        GroupeEquipes.create({
                          groupe_id: groupe.id,
                          equipe_id: equipeFinded.id,
                        });
                        Order.create({
                          groupe_id: groupe.id,
                          equipe_id: equipeFinded.id,
                          event_id: event_id,
                        });
                      }
                    }
                  );
                }
              });
            });
          });

          return res.status(200).send({
            message: MSG.CREATE_SUCCESUFULLY,
          });
        })
        .on("error", function (error) {
          res.status(500).send({ message: MSG.READ_ERROR });
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: MSG.CREATE_ERROR });
    }
  }
);
/*            ****** Get List Equipes  ******      */

EquipeRoutes.get(URLs.GET_EQUIPES, auth, isActive, async function (req, res) {
  try {
    const listeEquipes: Equipes[] = await Equipes.findAll();
    return res.status(200).send({ data: listeEquipes });
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});

/*            ****** Create equipes  ******      */

EquipeRoutes.post(
  URLs.CREATE_EQUIPES_Admin,
  auth,
  isActive,
  uploadLogos,
  isAdmin,
  async function (req, res) {
    const country = req.body.country;
    const name = req.body.name;
    const icon = req.body.icon;
    const images: any = req.file;
    const path = `${process.env.UPLOAD_PATH}/` + images?.name;

    if (!country || !name) {
      return res
        .status(400)
        .send({ success: false, message: MSG.DATA_MISSING });
    }

    try {
      Equipes.create({
        country: country,
        name: name,
        // icon:icon ,
        images: images.filename,
      })
        .then((equipe) => {
          if (!equipe) {
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
          res.status(500).send({ success: false, message: MSG.SQL_ERROR });
        });
    } catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }
);

export { EquipeRoutes };
