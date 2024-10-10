import User from "../models/user.model.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { z } from "zod"
import bcrypt from "bcrypt"
import { sendEmail } from "../utils/mailSender.js";
import otpGenerator from "otp-generator"
import crypto from "crypto"
import sendConfirmationEmail from "../mail/templetes/sendConfirmationEmail.js";


const AuthSchema = z.object({
    username: z.string({ message: "UserName is required and Username should be 3 to 20 character long " }).min(3).max(20),
    email: z.string({ message: "Email is required " }).email(),
    password: z.string({ message: "Password should be 8 characters long " }).min(8)
});

const signinSchema = z.object({
    email: z.string({ message: "Email is required" }).email(),
    password: z.string({ message: "Password is required" })
})

interface IAuth {
    username: string,
    email: string,
    password: string
}

class AuthController {

    static async signup(req: Request, res: Response) {
        try {
            const body: IAuth = req.body
            const { success } = AuthSchema.safeParse(body);
            console.log(success)
            if (!success) {
                return res.status(400).json({ message: "Invalid inputs" });
            }

            const user = await User.findOne({ email: body.email });
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashPassword = await bcrypt.hash(body.password, 10);
            const newUser = new User({
                username: body.username,
                email: body.email,
                password: hashPassword
            });
            await newUser.save();
            // generate random otp 
            const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            console.log(otp);

           const token=crypto.randomBytes(20).toString("hex");
           const url=`https://www.innobyteservices.com//auth/verify-email/${token}`;
           
            await sendEmail(body.email,`${sendConfirmationEmail(otp)}`,`Your Link for email verification is ${url}.`)

            return res.status(201).json({ message: "User created successfully" });
        } catch (error) {

            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }

    }

    static async signIn(req: Request, res: Response) {
        try {
            const body = req.body;
            const { success } = signinSchema.safeParse(body);
            if (!success) {
                return res.status(400).json({ message: "Invalid inputs" })
            }
            const user = await User.findOne({ email: body.email });
            if (!user) {
                return res.status(400).json({ message: "User not found" })
            }
            const isMatch = await bcrypt.compare(body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" })
            }
            const userId = user._id;
            const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.status(200).json({ message: "User logged in successfully" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Something went wrong" })
        }
    }

    static async signOut(req: Request, res: Response) {
        try {
            res.clearCookie("token");
            return res.status(200).json({ message: "User logged out successfully" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Something went wrong" })
        }
    }
    static async getUser(req: Request, res: Response) {
        try {
            const userPayload = (req as any).user;
            if (!userPayload || !userPayload.userId) {
                return res.status(401).json({ message: "Unauthorized: No user ID found" });
            }
            
            const userId = userPayload.userId;
            const user = await User.findById(userId).select("-password");
           
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Something went wrong" })
        }
    }
}


export default AuthController;