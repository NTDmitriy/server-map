"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = () => {
    const requader = (name) => {
        if (!process.env[name]) {
            throw new Error(`Environment variable ${name} is not set`);
        }
        return process.env[name];
    };
    return {
        app: {
            port: parseInt(process.env.PORT || "8080"),
        },
        auth: {
            secret: requader("AUTH_SECRET"),
            systemUser: requader("SYSTEM_USER"),
            systemUserPassword: requader("SYSTEM_USER_PASSWORD"),
            googleClientId: requader("GOOGLE_CLIENT_ID"),
            googleClientSecret: requader("GOOGLE_CLIENT_SECRET"),
            sessionSecret: requader("SESSION_SECRET"),
        },
    };
};
