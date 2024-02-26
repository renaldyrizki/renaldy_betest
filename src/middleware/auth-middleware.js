import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.config.js";

export const authMiddleware = async (req, res, next) => {
    const bearerToken = req.get('Authorization');
    const token = bearerToken.split("Bearer ");
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        await jwt.verify(token[1], jwtSecret, (err, user) => {
            if (err) {
                return res.status(401).json({ errors: 'Unauthorized' });
            }
            req.user = user;
            next();
        });
    }
}
