import { NextFunction, Request, Response } from "express";
import { User } from "../sqlModels/user";

const isCommercial = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const {role} = res.locals.currentUser as User
    if(role === "commercial"){
    next()
    return
    ;}
    res.status(403).send("unauthorized");
  } catch (error) {
    res.status(403).send("IToken expired");
  }
};

export default isCommercial;