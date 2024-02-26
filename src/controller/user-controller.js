import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getByIdentityNumber = async (req, res, next) => {
    try {
        const identityNumber = req.params.identityNumber;
        const result = await userService.getByIdentityNumber(identityNumber);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getByAccountNumber = async (req, res, next) => {
    try {
        const accountNumber = req.params.accountNumber;
        const result = await userService.getByAccountNumber(accountNumber);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const id = req.user.id;
        const result = await userService.get(id);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const id = req.user.id;
        const request = req.body;
        request.id = id;

        const result = await userService.update(request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        await userService.remove(req.user.id);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    get,
    getByAccountNumber,
    getByIdentityNumber,
    update,
    remove
}
