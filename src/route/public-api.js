import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
publicRouter.get('/api/health', 
    async (req, res, next) => { 
        res.status(200).json({data: "OK"})
    });
publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);

export {
    publicRouter
}
