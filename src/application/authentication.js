import jwt from "jsonwebtoken";
import { jwtSecret, jwtExpressIn } from "../config/jwt.config.js";

const generateToken = async (data) => {
    if (data) {
        const payload = {
            id: data.id,
            userName: data.userName,
            emailAddress: data.emailAddress,
            accountNumber: data.accountNumber,
            identityNumber: data.identityNumber
        }
        const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpressIn });
        const result = {
            token_type: "Bearer",
            access_token: token,
            expiresIn: jwtExpressIn
        }
        return result;
    }

    return null;
}

export {
    generateToken
}