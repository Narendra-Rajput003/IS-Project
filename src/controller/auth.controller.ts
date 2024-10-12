import User from "../models/user.model.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { z } from "zod"
import bcrypt from "bcrypt"
import { sendEmail } from "../utils/mailSender.js";
import otpGenerator from "otp-generator"
import crypto from "crypto"
import sendConfirmationEmail from "../mail/templetes/sendConfirmationEmail.js";
import { redis, validateRedisConnection } from "../config/redis.config.js";
import { getUserFromCache, setUserToCache } from "../services/cacheServices.js";



const AuthSchema = z.object({
    username: z.string({ message: "UserName is required and Username should be 3 to 20 character long " }).min(3).max(20),
    email: z.string({ message: "Email is required " }).email(),
    password: z.string({ message: "Password should be 8 characters long " }).min(8)
});

const signinSchema = z.object({
    email: z.string({ message: "Email is required" }).email(),
    password: z.string({ message: "Password is required" })
})

export interface IAuth {
    username: string,
    email: string,
    password: string
}

class AuthController {

    static async signup(req: Request, res: Response) {
        try {
            const body: IAuth = req.body
            const { success } = AuthSchema.safeParse(body);

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

            const token = crypto.randomBytes(20).toString("hex");
            const url = `https://www.innobyteservices.com//auth/verify-email/${token}`;

            await sendEmail(body.email, `OTP Verification Email `, sendConfirmationEmail(otp, url))

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
            const isRedisConnected = await validateRedisConnection();
            if (!isRedisConnected) {
                return res.status(500).json({ message: "Redis connection error" });
            }
    
            const userId = (req as any).userId; // Consider creating a custom Request type with userId
            console.log(`Fetching user:${userId}`);
    
            try {
                // Try to get user from cache
                const cachedUser = await getUserFromCache(userId);
                
                if (cachedUser) {
                    console.log(`Cache hit for user:${userId}`);
                    return res.status(200).json({ user: cachedUser });
                }
    
                console.log(`Cache miss for user:${userId}`);
                // User not in cache, fetch from database
                const user: IAuth | null = await User.findById(userId);
                
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
    
                // Cache the user
                await setUserToCache(userId, user);
    
                return res.status(200).json({ user });
            } catch (cacheError) {
                console.error('Cache operation failed:', cacheError);
                // Fallback to database if cache fails
                const user: IAuth | null = await User.findById(userId);
                
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
    
                return res.status(200).json({ user });
            }
        } catch (error) {
            console.error('Error in getUser:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    
}


export default AuthController;