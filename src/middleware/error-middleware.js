import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        logger.error({status: err.status, message: err.message});
        res.status(err.status).json({
            errors: err.message
        }).end();
    }  else {
        logger.error(err);
        res.status(500).json({
            errors: "Internal Server Error"
        }).end();
    }
}

export {
    errorMiddleware
}
