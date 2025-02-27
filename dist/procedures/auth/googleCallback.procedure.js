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
    async execute(params, user) {
        const { name, picture, email } = user._json;
        const candidate = await this.services.users.getByEmail(email);
        if (candidate)
            return candidate;
        const hashedPassword = await (0, argon2_1.hash)([...Array(8)].map(() => Math.random().toString(36)[2]).join(""));
        const newUser = await this.services.users.create({
            email,
            password: hashedPassword,
            name,
            picture,
        });
        return newUser;
    }
}
LoginProcedure.title = "google/callback";
LoginProcedure.method = api_methods_type_1.API_METHODS.GET;
LoginProcedure.tags = [
    tags_type_1.API_GUARD.PUBLIC,
    tags_type_1.MAIN_TAGS.AUTH,
    tags_type_1.HELPFUL_TAGS.SIGNIN,
    tags_type_1.HELPFUL_TAGS.PASSPORT_GOOGLE,
    tags_type_1.HELPFUL_TAGS.PASSPORT_CALLBACK,
];
LoginProcedure.summary = "Колбэк гугла после успешной аунтификации";
LoginProcedure.paramsSchema = {
    type: "object",
    additionalProperties: false,
    properties: {},
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
