import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const generateToken = (req: Request, res: Response, next: NextFunction): void => {

  const token = req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : req.cookies.token;

  
  console.log("token",token)

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
