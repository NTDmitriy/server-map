"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_methods_type_1 = require("../../types/api-methods.type");
const tags_type_1 = require("../../types/tags.type");
const procedure_1 = __importDefault(require("../procedure"));
class LoginProcedure extends procedure_1.default {
    async execute(params) {
        return null;
    }
}
LoginProcedure.title = "steamLogin";
LoginProcedure.method = api_methods_type_1.API_METHODS.GET;
LoginProcedure.tags = [
    tags_type_1.API_GUARD.PUBLIC,
    tags_type_1.MAIN_TAGS.AUTH,
    tags_type_1.HELPFUL_TAGS.SIGNIN,
    tags_type_1.HELPFUL_TAGS.PASSPORT_STEAM,
    tags_type_1.HELPFUL_TAGS.PASSPORT_CALLBACK,
];
LoginProcedure.summary = "Логин стим";
LoginProcedure.paramsSchema = {
    type: "object",
    additionalProperties: false,
    properties: {},
};
LoginProcedure.resultSchema = {
    type: "null",
    additionalProperties: false,
};
exports.default = LoginProcedure;
