"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajvPlugin = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const plugin = async (fastify, options) => {
    const ajv = new ajv_1.default({
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true,
    });
    (0, ajv_formats_1.default)(ajv);
    (0, ajv_errors_1.default)(ajv, { singleError: true });
    fastify.setValidatorCompiler(opt => ajv.compile(opt.schema));
};
exports.ajvPlugin = (0, fastify_plugin_1.default)(plugin, {
    name: "ajv-plugin",
});
