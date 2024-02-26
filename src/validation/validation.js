import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false
    })
    if (result.error) {
        logger.error(result.error.message);
        throw new ResponseError(400, "Bad Request");
    } else {
        return result.value;
    }
}

export {
    validate
}
