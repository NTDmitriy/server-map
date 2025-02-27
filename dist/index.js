"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
async function startServer() {
    const config = (0, config_1.default)();
    const app = await (0, app_1.default)(config);
    try {
        const { port } = config.app;
        await app.ready();
        await app.listen({ port, host: "0.0.0.0" });
        console.log(`Server listening at http://localhost:${port}`);
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}
startServer();
