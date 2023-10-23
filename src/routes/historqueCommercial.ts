import express from "express";
import isActive from "../middlewares/active";
import auth from "../middlewares/auth";
import isCommercial from "../middlewares/commercial";
import { commercial } from "../sqlModels/commercial";
import { User } from "../sqlModels/user";
import { historiqueSolde } from "../sqlModels/historiqueSolde";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";
import { Company } from "../sqlModels/company";
const HistoriqueRoutes = express.Router();

/*            ****** Get historique  commercial   ******      */

HistoriqueRoutes.get(
  URLs.GET_HISTORIQUE_COMMERCIAL,
  auth,
 isCommercial,
  isActive,
  async function (req, res) {

    try {
      const { id, commercial_id } = res.locals.currentUser as User;
      const historiqueSoldeData = await historiqueSolde.findAll({
       
        include: [
          {
            model: Company,
            include:[{
              model: User,
              where: {role: 'partner'}, 
              attributes: {
                exclude: ["password"],
              },
            }]
          }
        ],
        where: { commercial_user: id, },
      });

      const commercialSolde = await commercial.findOne({
        where: {
          id: commercial_id
        },
      })
     
      return res.status(200).send({historiqueSoldeData, commercialSolde} );
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: MSG.SQL_ERROR });
    }
  }
);

export { HistoriqueRoutes };