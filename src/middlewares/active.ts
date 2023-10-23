import { NextFunction, Request, Response } from "express";
import { User } from "../sqlModels/user";

const isActive = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const {is_active} = res.locals.currentUser as User
    if(!is_active){
        res.status(401).send("account not active");
    }
    
    next();
  } catch (error) {
    res.status(403).send("IToken expired");
  }
};

export default isActive;
