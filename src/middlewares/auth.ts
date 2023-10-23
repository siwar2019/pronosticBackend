import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../sqlModels/user";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader === "undefined") throw new Error("No token");
    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("No token");
    const payload = verify(token, process.env.TOKEN_KEY) as {
      id: number;
      iat: number;
      exp: number;
    };
    if (!payload) {
      res.status(403).send({ message:"unauthorized"});
    }

    const currentUser = await User.findOne({
      where: { id: payload.id },
    });
    res.locals.currentUser = currentUser;
    next();
  } catch (error) {
    res.status(403).send({ message:"IToken expired"});
  }
};

export default auth;
