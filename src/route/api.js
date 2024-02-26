import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/me', userController.get);
userRouter.get('/api/users/identity_number/:identityNumber', userController.getByIdentityNumber);
userRouter.get('/api/users/account_number/:accountNumber', userController.getByAccountNumber);
userRouter.patch('/api/users/me', userController.update);
userRouter.delete('/api/users/me', userController.remove);

export {
    userRouter
}
