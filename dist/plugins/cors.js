"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsPlugin = void 0;
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const plugin = async (fastify, options) => {
    fastify.register(cors_1.default, {
        origin: [
            "http://localhost:3000",
        ],
        credentials: true,
    });
};
exports.corsPlugin = (0, fastify_plugin_1.default)(plugin, {
    name: "cors-plugin",
});
