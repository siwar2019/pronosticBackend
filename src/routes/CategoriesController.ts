import express from "express";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import auth from "../middlewares/auth";
import { Categories } from "../sqlModels/categories";
import { URLs } from "../util/common";
import { MSG } from "../util/translate/fr/translateFR";

const CategoriesRoutes = express.Router();


/*            ****** Create Categorie  ******      */

CategoriesRoutes.post(URLs.CREATE_CATEGORY, auth, isActive, isAdmin, async function (req, res) {
  const description = req.body.description;
  const name = req.body.name;
  const sport_icon = req.body.sport_icon;


  if ( !description || !name || !sport_icon ) {
    return res
      .status(400)
      .send({ success: false, message: MSG.DATA_MISSING});
  }

  try {
    Categories.create({
      description: description,
      name:name,
      sport_icon:sport_icon  
    }).then((category) => {
      if (!category) {
        return res.status(400).send({ message: MSG.CREATE_ERROR });
      }
          else {
            return res.status(200).send({
              message: MSG.CREATE_SUCCESUFULLY,
            });
          }
    })
      .catch((error) => {
        res.status(500).send({ success: false, message: MSG.SQL_ERROR });
      })
  } catch (error) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});
/*            ****** Get List Categories  ******      */

CategoriesRoutes.get(URLs.GET_CATEGORIES,auth, isActive, async function (req, res) {
  try {
    const listeCategories: Categories[] = await Categories.findAll();
    return res.status(200).send({ data: listeCategories });
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});



/*            ****** Get Categorie id  ******      */

CategoriesRoutes.get(URLs.GET_CATEGORY_BY_ID,auth, isActive, async (req, res) => {
  try{
    let id = req.query.id as string;

    if (!id)
      return res.status(400).send({ success: false, message: MSG.DATA_MISSING });
  
    const category: Categories | null = await Categories.findByPk(id);
    if (category) {
      return res.status(200).send({success: true, data: category });
    } else {
      return res.status(400).send({ success: false, message: MSG.NOT_FOUND });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: MSG.SQL_ERROR });
}
 
});
/*            ****** Delete Category  ******      */

CategoriesRoutes.post(URLs.DELETE_CATEGORY, auth, isAdmin, isActive, async function (req, res) {
  const id = req.body.id;

  if (!id) {
    return res.status(400).send({ success: false, message: MSG.DATA_MISSING });
  }

  try {
    const category: Categories | null = await Categories.findByPk(id);
    if (category) {
      Categories.destroy({ where: { id: category.id } })
        .then((deleted) => {
          return res.status(200).send({ message: MSG.DELETED_SUCCUSSFULLY });
        })
        .catch((error) => {
          console.log(error)
          res.status(500).send({ message: MSG.SQL_ERROR });
        });
    } else {
      return res
        .status(400)
        .send({ success: false, message: MSG.NOT_FOUND });
    }

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});

/*            ****** Edit Categorie  ******      */

CategoriesRoutes.put(URLs.UPDATE_CATEGORY, auth, isActive, isAdmin, async function (req, res) {
  const id = req.body.id;
  const description = req.body.description;
  const name = req.body.name;
  const sport_icon = req.body.sport_icon;


  if (!id || !description || !name || !sport_icon ) {
    return res
      .status(400)
      .send({ success: false, message: MSG.DATA_MISSING, data: req.body });
  }

  try {
    const category: Categories | null = await Categories.findOne({ where: { id: id} });
    if (!category) {
      return res
        .status(400)
        .send({ success: false, message: MSG.NOT_FOUND });
    }
    Categories.update({
      description: description,
      name:name,
      sport_icon:sport_icon
    }, {
      where: {
        id:id
      }
    }).then((updatedCategorie) => {
      if (!updatedCategorie) {
        return res.status(400).send({ message: MSG.UPDATED_ERROR });
      }
          else {
            return res.status(200).send({
              message: MSG.UPDATED_SUCCESUFULLY,
            });
          }
    })
      .catch((error) => {
        res.status(500).send({ success: false, message: MSG.SQL_ERROR });
      })
  } catch (error) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});


export { CategoriesRoutes };
