import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: string;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;

    console.log("Received token:", token);

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        
        if (!decoded.userId) {
            throw new Error('Token does not contain userId');
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token" });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Token expired" });
        } else {
            res.status(401).json({ message: "Token verification failed" });
        }
    }
};
