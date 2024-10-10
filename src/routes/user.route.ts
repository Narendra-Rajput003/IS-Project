import { Router } from "express";
import AuthController from "../controller/auth.controller.js";
import { generateToken } from "../middleware/auth.js";

const route=Router();







route.post("/signIn",AuthController.signIn);
route.post("/signUp", AuthController.signup);
route.post("/signOut", AuthController.signOut);
route.get("/profile",generateToken,AuthController.getUser);

export default route;