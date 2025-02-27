"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = require("argon2");
const api_methods_type_1 = require("../../types/api-methods.type");
const tags_type_1 = require("../../types/tags.type");
const procedure_1 = __importDefault(require("../procedure"));
class LoginProcedure extends procedure_1.default {
    async execute(params) {
        const { email, password } = params;
        const user = await this.services.users.getByEmail(email);
        if (!user || !user.password)
            throw new Error("Неверный логин или пароль");
        const isPasswordValid = await (0, argon2_1.verify)(user.password, password);
        if (!isPasswordValid)
            throw new Error("Неверный логин или пароль");
        return user;
    }
}
LoginProcedure.title = "login";
LoginProcedure.method = api_methods_type_1.API_METHODS.POST;
LoginProcedure.tags = [tags_type_1.API_GUARD.PUBLIC, tags_type_1.MAIN_TAGS.AUTH, tags_type_1.HELPFUL_TAGS.SIGNIN];
LoginProcedure.summary = "Вход в систему";
LoginProcedure.paramsSchema = {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
        email: {
            type: "string",
            format: "email",
            errorMessage: "Email введен не корректно",
        },
        password: {
            type: "string",
        },
    },
};
LoginProcedure.resultSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
    },
};
exports.default = LoginProcedure;
