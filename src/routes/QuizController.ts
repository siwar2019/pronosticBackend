import express, { response } from "express";
import { URLs } from "../util/common";
import auth from "../middlewares/auth";
import isActive from "../middlewares/active";
import isAdmin from "../middlewares/admin";
import { MSG } from "../util/translate/fr/translateFR";
import { Quizs } from "../sqlModels/quiz";
import { uploads } from "../middlewares/multer";
import { questionQuiz } from "../sqlModels/questionQuiz";
import { responseQuiz } from "../sqlModels/responseQuiz";
import { ScoreQuiz } from "../sqlModels/scoreQuiz";
import { sequelize } from "../sequelize";
import { User } from "../sqlModels/user";
import isEmployee from "../middlewares/employee";
import e from "express";
const QuizRoutes = express.Router();
QuizRoutes.post(
  URLs.CREATE_QUIZ,
  auth,
  isActive,
  isAdmin,
  uploads,
  async function (req, res) {

    const nom = req.body.nom;
    const category = req.body.category;
    const description = req.body.description;
    const image: any = req.file;
    // const isDisplayedByPartner= 0 ;
    const path = `${process.env.UPLOAD_EVENTS_PATH}` + image?.name;

    try {
      if (!nom || !category || !description) {
        return res.status(400).send({ success: false, message: MSG.DATA_MISSING, data: { nom, category, description } })
      }

      Quizs.create({
        nom: nom,
        category: category,
        description: description,
        image: image.filename
      })
      return res.status(200).send({
        success: true, message: "success",
      })

    }
    catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR, data: { nom, category } });
    }
  }

);
/* get liste des quiz event */
QuizRoutes.get(URLs.GET_QUIZ, async function (req, res) {
  try {
    const listeQuiz: Quizs[] = await Quizs.findAll();
    return res.status(200).send({ data: listeQuiz });
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});

//create questionQuiz multiple choices

QuizRoutes.post(
  URLs.CREATE_QUESTION_QUIZ,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { type, dateStart, dateExpiration, points, questionDescription
        , QuizId, response } = req.body;
      if (!type || !dateStart || !dateExpiration || !points || !questionDescription || !response) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }



      const questionDataMultiple = await questionQuiz.create({
        type: type,
        dateStart: dateStart,
        dateExpiration: dateExpiration,
        points: points,
        questionDescription: questionDescription,
        QuizId: parseInt(QuizId.id),


      })

      for (let index = 0; index < response.length; index++) {

        responseQuiz.create({
          response: JSON.stringify(response[index].choices),
          questionId: questionDataMultiple.id,
          isCorrectAnswer: response[index].correctAnswer
        })

      }

      return res.status(200).send({
        success: true, message: "success", data: {
          type, dateStart, QuizId, dateExpiration, points,
          response
        }
      })

    }
    catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }

);
//create question quiz one single choice
QuizRoutes.post(
  URLs.CREATE_QUESTION_QUIZ_single,
  auth,
  isActive,
  isAdmin,
  async function (req, res) {
    try {
      const { type, dateStart, dateExpiration, points, questionDescription
        , QuizId, response, questionId } = req.body;
      if (!type || !dateStart || !dateExpiration || !points || !questionDescription || !response) {
        return res
          .status(400)
          .send({ success: false, message: MSG.DATA_MISSING });
      }
      const questionData = await questionQuiz.create({
        type: type,
        dateStart: dateStart,
        dateExpiration: dateExpiration,
        points: points,
        questionDescription: questionDescription,
        QuizId: parseInt(QuizId.id),

      })

      responseQuiz.create({
        response: response,
        questionId: questionData.id,
        isCorrectAnswer: 1
      })



      return res.status(200).send({
        success: true, message: "success", data: {
          type, dateStart, QuizId, dateExpiration, points,
          response, questionId
        }
      })

    }
    catch (error) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  }

);


//get list of questions 
QuizRoutes.post(URLs.GET_Questions,

  async function (req, res) {
    try {
      const { id } = req.body;
      const questionList: questionQuiz[] = await questionQuiz.findAll(
        {
          where: {
            QuizId: id as number,
          }
        }
      );
      return res.status(200).send({ data: questionList });
    } catch (err) {
      res.status(500).send({ message: MSG.SQL_ERROR });
    }
  });
//GET_RESPONSES
QuizRoutes.post(URLs.GET_RESPONSES, async function (req, res) {

  try {
    const { id } = req.body;
    const responsesListe: responseQuiz[] = await responseQuiz.findAll(
      {
        where: {
          questionId: id as any,
        }
      }
    );
    return res.status(200).send({ data: responsesListe });
  } catch (err) {
    res.status(500).send({ message: MSG.SQL_ERROR });
  }
});
//update score
QuizRoutes.post(URLs.UPDATE_SCORE_QUIZ,
  auth,
  isActive,
  isEmployee,
  async function (req, res) {

    // try {
    const { score } = req.body;
    const { id } = req.body;
    const connectedUser = res.locals.currentUser.id as User
    const userexist = await ScoreQuiz.findAll({
      where: { userId: connectedUser },
    });
    const userExistLenght = userexist.length;


    if (userExistLenght === 0) {
      const resData = ScoreQuiz.create(
        {
          score: score,
          userId: connectedUser,
          quizId: id.id

        }
      );
      // return res.status(200).send({ data: resData });

    } else {
      const ress = ScoreQuiz.update(
        {
          score: score,


        },
        {
          where: {
            userId: connectedUser,
            quizId: id.id


          }
        }

      );
      //return res.status(200).send({ data: ress });

    }

  }

  // } catch (err) {
  //   res.status(500).send({ message: MSG.SQL_ERROR });
  // }
)
export { QuizRoutes }
