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
LoginProcedure.title = "logout";
LoginProcedure.method = api_methods_type_1.API_METHODS.GET;
LoginProcedure.tags = [tags_type_1.API_GUARD.PUBLIC, tags_type_1.MAIN_TAGS.AUTH, tags_type_1.HELPFUL_TAGS.LOGOUT];
LoginProcedure.summary = "Выход из системы";
LoginProcedure.paramsSchema = {
    type: "object",
    additionalProperties: false,
    properties: {},
};
LoginProcedure.resultSchema = {
    type: "object",
    additionalProperties: false,
    properties: {},
};
exports.default = LoginProcedure;
