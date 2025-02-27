"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const tokens_service_1 = __importDefault(require("../services/tokens/tokens.service"));
const plugin = async (fastify, options) => {
    const { auth } = options;
    const tokensService = new tokens_service_1.default(auth.secret);
    fastify.decorate("verifyAccess", async function (request, reply) {
        try {
            const { accessToken, refreshToken } = request.cookies;
            if (accessToken && !refreshToken) {
                const decoded = tokensService.verify(accessToken);
                request.user = decoded;
                return;
            }
            if (refreshToken) {
                const decoded = tokensService.verify(refreshToken);
                request.user = decoded;
                return;
            }
            reply.status(401).send({ error: "Unauthorized" });
        }
        catch (err) {
            reply.status(401).send({ error: "Unauthorized", message: err.message });
        }
    });
};
exports.verifyToken = (0, fastify_plugin_1.default)(plugin, {
    name: "verifyAccess-plugin",
});
