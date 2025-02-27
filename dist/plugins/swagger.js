"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerPlugin = void 0;
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const tags_type_1 = require("../types/tags.type");
const swaggerOptions = {
    openapi: {
        info: {
            title: "Панель администратора",
            version: "1.0.0",
        },
        tags: [
            { name: tags_type_1.MAIN_TAGS.AUTH, description: "Аутентификация" },
            // { name: "User", description: "Управление пользователями" },
            // { name: "Blog", description: "Управление блогом" },
        ],
    },
    exposeRoute: false,
};
const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: false,
    tags: [{ name: tags_type_1.MAIN_TAGS.AUTH, description: "Аутентификация" }],
};
const plugin = async (fastify, options) => {
    fastify.register(swagger_1.default, swaggerOptions);
    fastify.register(swagger_ui_1.default, swaggerUiOptions);
};
exports.swaggerPlugin = (0, fastify_plugin_1.default)(plugin, {
    name: "swagger-plugin",
});
