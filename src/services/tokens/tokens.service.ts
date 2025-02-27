import { FastifyReply } from "fastify"
import * as jwt from "jsonwebtoken"
import { API_GUARD, HELPFUL_TAGS, TTags } from "../../types/tags.type"
import { TJwtVerifyObject } from "./tokens.type"

class TokensService {
    private readonly JWT_SECRET: string
    private readonly TOKEN_EXPIRATION_ACCESS: number
    private readonly TOKEN_EXPIRATION_REFRESH: number

    constructor(secret: string) {
        this.JWT_SECRET = secret
        this.TOKEN_EXPIRATION_ACCESS = parseInt("43200", 10)
        this.TOKEN_EXPIRATION_REFRESH = parseInt("604800", 10)
    }

    proccess(reply: FastifyReply, tags: TTags, result?: any, user?: any): void {
        if (tags.includes(API_GUARD.PRIVATE) && user && user.userId) {
            this.generateAccessToken({ userId: user.userId }, reply)
        }

        if (tags.includes(HELPFUL_TAGS.SIGNIN) && result && result.id) {
            this.generateTokens({ userId: result.id }, reply)
        }

        if (tags.includes(HELPFUL_TAGS.LOGOUT)) {
            this.clearAuthTokens(reply)
        }
    }

    sign(payload: object, options?: jwt.SignOptions) {
        return jwt.sign(payload, this.JWT_SECRET, options)
    }

    verify(token: string, options?: jwt.VerifyOptions): TJwtVerifyObject | null {
        try {
            return jwt.verify(token, this.JWT_SECRET, options) as TJwtVerifyObject
        } catch (e) {
            return null
        }
    }

    generateAccessToken(payload: object, reply: FastifyReply): void {
        const accessToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_ACCESS })

        reply.setCookie("accessToken", accessToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: true,
        })
    }

    generateRefreshToken(payload: object, reply: FastifyReply): void {
        const refreshToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_REFRESH })

        reply.setCookie("refreshToken", refreshToken, {
            path: "/api/auth/checkRefresh",
            secure: true,
            httpOnly: true,
            sameSite: true,
        })
    }

    generateTokens(payload: object, reply: FastifyReply): void {
        this.generateAccessToken(payload, reply)
        this.generateRefreshToken(payload, reply)
    }

    clearAuthTokens(reply: FastifyReply): void {
        reply.clearCookie("accessToken", { path: "/" })
        reply.clearCookie("refreshToken", { path: "/api/auth/checkRefresh" })
    }
}

export default TokensService
