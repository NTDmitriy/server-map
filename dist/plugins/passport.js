"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportPlugin = void 0;
const passport_1 = __importDefault(require("@fastify/passport"));
const session_1 = __importDefault(require("@fastify/session"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_steam_1 = require("passport-steam");
const plugin = async (fastify, options) => {
    const { auth } = options;
    fastify.register(session_1.default, {
        secret: options.auth.sessionSecret,
    });
    fastify.register(passport_1.default.initialize());
    fastify.register(passport_1.default.secureSession());
    passport_1.default.registerUserSerializer(async (user, request) => {
        return user;
    });
    passport_1.default.registerUserDeserializer(async (user, request) => {
        return user;
    });
    passport_1.default.use("google", new passport_google_oauth20_1.Strategy({
        clientID: auth.googleClientId,
        clientSecret: auth.googleClientSecret,
        callbackURL: "http://localhost:8080/api/auth/google/callback",
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));
    passport_1.default.use("steam", new passport_steam_1.Strategy({
        returnURL: "http://localhost:8080/api/auth/steam/callback",
        realm: "http://localhost:8080/",
        apiKey: "7DE1308F391F276B869AA7D4525DD839",
    }, function (identifier, profile, done) {
        return done(null, profile);
    }));
};
exports.passportPlugin = (0, fastify_plugin_1.default)(plugin, {
    name: "passport-plugin",
});
