"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const tags_type_1 = require("../../types/tags.type");
class TokensService {
    constructor(secret) {
        this.JWT_SECRET = secret;
        this.TOKEN_EXPIRATION_ACCESS = parseInt("43200", 10);
        this.TOKEN_EXPIRATION_REFRESH = parseInt("604800", 10);
    }
    proccess(tags, reply, result, user) {
        if (tags.includes(tags_type_1.HELPFUL_TAGS.LOGOUT)) {
            this.clearAuthTokens(reply);
        }
        if (tags.includes(tags_type_1.API_GUARD.PRIVATE) &&
            !tags.includes(tags_type_1.HELPFUL_TAGS.LOGOUT) &&
            user.userId) {
            this.generateAccessToken({ userId: user.userId }, reply);
        }
        if (tags.includes(tags_type_1.HELPFUL_TAGS.SIGNIN) && result.id) {
            this.generateTokens({ userId: result.id }, reply);
        }
    }
    sign(payload, options) {
        return jwt.sign(payload, this.JWT_SECRET, options);
    }
    verify(token, options) {
        try {
            return jwt.verify(token, this.JWT_SECRET, options);
        }
        catch (e) {
            return null;
        }
    }
    generateAccessToken(payload, reply) {
        const accessToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_ACCESS });
        reply.setCookie("accessToken", accessToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: true,
        });
    }
    generateRefreshToken(payload, reply) {
        const refreshToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_REFRESH });
        reply.setCookie("refreshToken", refreshToken, {
            path: "/api/auth/checkRefresh",
            secure: true,
            httpOnly: true,
            sameSite: true,
        });
    }
    generateTokens(payload, reply) {
        this.generateAccessToken(payload, reply);
        this.generateRefreshToken(payload, reply);
    }
    clearAuthTokens(reply) {
        reply.clearCookie("accessToken", { path: "/" });
        reply.clearCookie("refreshToken", { path: "/api/auth/checkRefresh" });
    }
}
exports.default = TokensService;
