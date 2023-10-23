import { NextFunction, Request, Response } from "express";
import { User } from "../sqlModels/user";

const isEmployee = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const {role} = res.locals.currentUser as User
    if(role === "employee"){
    next()
    return
    ;}
    res.status(403).send("unauthorized");
  } catch (error) {
    res.status(403).send("IToken expired");
  }
};

export default isEmployee;