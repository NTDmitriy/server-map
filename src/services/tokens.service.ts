import { FastifyInstance, FastifyReply } from "fastify"

class TokensService {
    private app: FastifyInstance

    constructor(app: FastifyInstance) {
        this.app = app
    }

    generateAccessToken(payload: object, reply: FastifyReply): void {
        const accessToken = this.app.jwt.sign(payload, { expiresIn: "1h" })

        reply.setCookie("accessToken", accessToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: true,
        })
    }

    generateRefreshToken(payload: object, reply: FastifyReply): void {
        const refreshToken = this.app.jwt.sign(payload, { expiresIn: "7h" })

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

    clearTokens(reply: FastifyReply): void {
        reply.clearCookie("accessToken", { path: "/" })
        reply.clearCookie("refreshToken", { path: "/api/auth/checkRefresh" })
    }
}

export default TokensService
