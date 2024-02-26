import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    getUserValidationByIdentityNumber,
    getUserValidationByAccountNumber,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {generateToken} from "../application/authentication.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {redisClient} from "../application/redis.js";
import {redisExpiressIn} from "../config/redis.config.js";

const register = async (request) => {
    try {
        const user = validate(registerUserValidation, request);
        user.pin = await bcrypt.hash(user.pin, redisExpiressIn);
        
        const result = await prismaClient.user.create({
            data: {
              userName: user.userName,
              pin: user.pin,
              accountNumber: user.accountNumber,
              emailAddress: user.emailAddress,
              identityNumber: user.identityNumber
            },
            select: {
                userName: true,
                emailAddress: true,
                identityNumber: true,
                accountNumber: true
            }
        })

        return result
    } catch(e) {
        if (e?.code === 'P2002' && e?.meta?.target) {
            const violatingField = e.meta.target;
            const fieldName = violatingField.split('_');
            throw new ResponseError(400, `${fieldName[1]} already exist`);
        }

        throw e;
    }
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            userName: loginRequest.userName
        },
    });

    if (!user) {
        throw new ResponseError(401, "Username or pin wrong");
    }

    const isPinValid = await bcrypt.compare(loginRequest.pin, user.pin);
    if (!isPinValid) {
        throw new ResponseError(401, "Username or pin wrong");
    }

    const token = await generateToken(user)

    return token
}

const getByIdentityNumber = async (identityNumber) => {
    const userIdentity = validate(getUserValidationByIdentityNumber, identityNumber);
    const cachedData = await redisClient.get(`user:identityNumber:${identityNumber}`);
    if (cachedData) {
        const data = JSON.parse(cachedData);
        return data;
    }
    const user = await prismaClient.user.findFirst({
        where: {
            identityNumber : userIdentity 
        },
        select: {
            userName: true,
            emailAddress: true,
            identityNumber: true,
            accountNumber: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    await redisClient.set(`user:identityNumber:${identityNumber}`, JSON.stringify(user));
    await redisClient.expire(`user:identityNumber:${identityNumber}`, redisExpiressIn);

    return user;
}

const getByAccountNumber = async (accountNumber) => {
    const userIdentity = validate(getUserValidationByAccountNumber, accountNumber);
    const cachedData = await redisClient.get(`user:accountNumber:${accountNumber}`);
    if (cachedData) {
        const data = JSON.parse(cachedData);
        return data;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            accountNumber : userIdentity 
        },
        select: {
            userName: true,
            emailAddress: true,
            identityNumber: true,
            accountNumber: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    await redisClient.set(`user:accountNumber:${accountNumber}`, JSON.stringify(user));
    await redisClient.expire(`user:accountNumber:${accountNumber}`, redisExpiressIn);

    return user;
}

const get = async (id) => {
    const userId = validate(getUserValidation, id);
    const cachedData = await redisClient.get(`user:id:${userId}`);
    if (cachedData) {
        const data = JSON.parse(cachedData);
        return data;
    }
    const user = await prismaClient.user.findFirst({
        where: {
            id: userId
        },
        select: {
            userName: true,
            emailAddress: true,
            identityNumber: true,
            accountNumber: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    await redisClient.set(`user:id:${userId}`, JSON.stringify(user));
    await redisClient.expire(`user:id:${userId}`, redisExpiressIn);

    return user;
}

const update = async (request) => {
    try{
        const user = validate(updateUserValidation, request);

        const isExist = await prismaClient.user.findUnique({
            where: {
                id: user.id
            }
        });
    
        if (!isExist) {
            throw new ResponseError(404, "user is not found");
        }
        
        const data = {};
        if (user.userName) {
            data.userName = user.userName;
        }

        if (user.emailAddress) {
            data.emailAddress = user.emailAddress;
        }

        if (user.identityNumber) {
            data.identityNumber = user.identityNumber;
        }

        if (user.accountNumber) {
            data.identityNumber = user.accountNumber;
        }

        if (user.password) {
            data.password = await bcrypt.hash(user.password, 10);
        }
    
        const result = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: data,
            select: {
                userName: true,
                emailAddress: true,
                identityNumber: true,
                accountNumber: true
            }
        })

        await redisClient.set(`user:id:${user.id}`, JSON.stringify(result));
        await redisClient.expire(`user:id:${user.id}`, redisExpiressIn);

        if (user?.identityNumber) {
            await redisClient.set(`user:identityNumber:${user.id}`, JSON.stringify(result));
            await redisClient.expire(`user:identityNumber:${user.id}`, redisExpiressIn);
        }

        if (user?.accountNumber) {
            await redisClient.set(`user:accountNumber:${user.id}`, JSON.stringify(result));
            await redisClient.expire(`user:accountNumber:${user.id}`, redisExpiressIn);
        }
        

        return result
    } catch(e) {
        if (e?.code === 'P2002' && e?.meta?.target) {
            const violatingField = e.meta.target;
            const fieldName = violatingField.split('_');
            throw new ResponseError(400, `${fieldName[1]} already exist`);
        }

        throw e;
    }
}

const remove = async (id) => {
    const userId = validate(getUserValidation, id);

    const isExist = await prismaClient.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!isExist) {
        throw new ResponseError(404, "user is not found");
    }

    const result = await prismaClient.user.delete({
        where: {
            id: userId
        },
    })

    if(!result){
        throw new ResponseError(404, "Delete user is failed");
    }

    await redisClient.del(`user:id:${userId}`);
    await redisClient.del(`user:identityNumber:${userId}`);
    await redisClient.del(`user:accountNumber:${userId}`);

    return result
}

export default {
    register,
    login,
    get,
    getByIdentityNumber,
    getByAccountNumber,
    update,
    remove
}
