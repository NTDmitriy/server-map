"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_methods_type_1 = require("../../types/api-methods.type");
const tags_type_1 = require("../../types/tags.type");
const procedure_1 = __importDefault(require("../procedure"));
class LoginProcedure extends procedure_1.default {
    async execute(params, user) {
        const { personaname, avatar, steamid } = user._json;
        const candidate = await this.services.users.getBySteamId(steamid);
        if (candidate)
            return candidate;
        const newUser = await this.services.users.createWithSteam({
            name: personaname,
            picture: avatar,
            steamId: steamid,
        });
        return newUser;
    }
}
LoginProcedure.title = "steam/callback";
LoginProcedure.method = api_methods_type_1.API_METHODS.GET;
LoginProcedure.tags = [
    tags_type_1.API_GUARD.PUBLIC,
    tags_type_1.MAIN_TAGS.AUTH,
    tags_type_1.HELPFUL_TAGS.SIGNIN,
    tags_type_1.HELPFUL_TAGS.PASSPORT_STEAM,
    tags_type_1.HELPFUL_TAGS.PASSPORT_CALLBACK,
];
LoginProcedure.summary = "Колбэк стим после успешной аунтификации";
LoginProcedure.paramsSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        steamId: { type: "string" },
    },
};
LoginProcedure.resultSchema = {
    type: "null",
    additionalProperties: false,
};
exports.default = LoginProcedure;
