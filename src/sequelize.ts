import { Sequelize } from "sequelize-typescript";
import { Company } from "./sqlModels/company";
import { Categories } from "./sqlModels/categories";
import { Events } from "./sqlModels/events";
import { Groupes } from "./sqlModels/groupes";
import { Equipes } from "./sqlModels/equipe";
import { Matchs } from "./sqlModels/Matchs";
import { Score } from "./sqlModels/score";
import dbConfig from "./db.config";
import { Dialect } from "sequelize/types";
import { User } from "./sqlModels/user";
import { MatchEquipes } from "./sqlModels/matchEquipes";
import { GroupeEquipes } from "./sqlModels/groupeEquipes";
import { UserEvents } from "./sqlModels/userEvents";
import { Pronostics } from "./sqlModels/pronostic";
import { PronosticsMatchs } from "./sqlModels/pronosticsMatchs";
import { TotalPronostics } from "./sqlModels/totalPronostics";
import { Order } from "./sqlModels/order";
import { Order_Match } from "./sqlModels/order_match";
import { Draw } from "./sqlModels/draw";
import { DrawScore } from "./sqlModels/drawScore";
import { Options } from "./sqlModels/options";
import { cashout } from "./sqlModels/cashout";
import { settings } from "./sqlModels/settings";
import { commercial } from "./sqlModels/commercial";
import { historiqueSolde } from "./sqlModels/historiqueSolde";
import { requestCashout } from "./sqlModels/requestCashout";
import { payments } from "./sqlModels/payments";
import { DrawSetting } from "./sqlModels/drawSetting";
import { Solde } from "./sqlModels/solde";
import { historicScore } from "./sqlModels/historicScore";
import { pronosticsHistory } from "./sqlModels/pronosticHistory";
import {Quizs} from "./sqlModels/quiz"
import{questionQuiz} from "./sqlModels/questionQuiz"
import { responseQuiz } from "./sqlModels/responseQuiz";
import { ScoreQuiz } from "./sqlModels/scoreQuiz";
export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    dialect: dbConfig.dialect as Dialect,
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    models: [
      Company,
      Categories,
      Events,
      Groupes,
      Equipes,
      Matchs,
      Score,
      User,
      MatchEquipes,
      GroupeEquipes,
      UserEvents,
      Pronostics,
      PronosticsMatchs,
      TotalPronostics,
      Order,
      Order_Match,
      Draw,
      DrawScore,
      Options,
      cashout,
      settings,
      commercial,
      historiqueSolde,
      requestCashout,
      payments,
      DrawSetting,
      Solde,
      historicScore,
      pronosticsHistory,
      Quizs,
      responseQuiz,
      questionQuiz,
      ScoreQuiz
      
    ],
    logging: false,
  }
);
