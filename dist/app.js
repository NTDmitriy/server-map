"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("@fastify/auth"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const plugins_1 = require("./plugins");
const passport_1 = require("./plugins/passport");
const procedures_1 = __importDefault(require("./procedures"));
const router_1 = __importDefault(require("./router"));
const tokens_service_1 = __importDefault(require("./services/tokens/tokens.service"));
const users_service_1 = __importDefault(require("./services/users/users.service"));
const fastify_1 = __importDefault(require("fastify"));
exports.default = async (config) => {
    const app = (0, fastify_1.default)({
        logger: false,
    });
    app.register(plugins_1.ajvPlugin);
    app.register(plugins_1.corsPlugin);
    app.register(plugins_1.swaggerPlugin);
    app.register(auth_1.default);
    app.register(plugins_1.verifyToken, config);
    app.register(cookie_1.default);
    app.register(passport_1.passportPlugin, config);
    const services = {
        users: new users_service_1.default({ log: app.log }),
        tokens: new tokens_service_1.default(config.auth.secret),
    };
    const procedures = (0, procedures_1.default)();
    await app.register(router_1.default, {
        procedures,
        services,
    });
    await Promise.all([
        await services.users.init({
            systemLogin: config.auth.systemUser,
            systemPassword: config.auth.systemUserPassword,
        }),
    ]);
    return app;
};
