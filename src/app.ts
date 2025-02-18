import fastifyAuth from "@fastify/auth"
import fastifyCookie from "@fastify/cookie"
import fastify from "fastify"
import type { IConfig } from "./config"
import { ajvPlugin, corsPlugin, swaggerPlugin, verifyToken } from "./plugins"
import getProcedures from "./procedures"
import router from "./router"
import TokensService from "./services/tokens.service"
import UsersService from "./services/users/users.service"
import type { TServices } from "./types/servises.type"

export default async (config: IConfig) => {
    const app = fastify({
        logger: false,
    })

    app.register(ajvPlugin)
    app.register(corsPlugin)
    app.register(swaggerPlugin)

    app.register(fastifyAuth)
    app.register(verifyToken, config)
    app.register(fastifyCookie)

    const services: TServices = {
        users: new UsersService({ log: app.log }),
        tokens: new TokensService(app),
    }

    const procedures = getProcedures()
    await app.register(router, {
        procedures,
        services,
    })

    await Promise.all([
        await services.users.init({
            systemLogin: config.auth.systemUser,
            systemPassword: config.auth.systemUserPassword,
        }),
    ])

    return app
}
