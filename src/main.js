import {web} from "./application/web.js";
import {logger} from "./application/logging.js";
import {appPort} from "./config/server.config.js";

web.listen(appPort, () => {
    logger.info(`App start on port ${appPort}`);
});
