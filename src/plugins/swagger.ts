import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fp from "fastify-plugin"
import { MAIN_TAGS } from "../types/tags.type"

const swaggerOptions = {
    openapi: {
        info: {
            title: "Панель администратора",
            version: "1.0.0",
        },
        tags: [
            { name: MAIN_TAGS.AUTH, description: "Аутентификация" },
            // { name: "User", description: "Управление пользователями" },
            // { name: "Blog", description: "Управление блогом" },
        ],
    },
    exposeRoute: false,
}

const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: false,
    tags: [{ name: MAIN_TAGS.AUTH, description: "Аутентификация" }],
}

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.register(fastifySwagger, swaggerOptions)
    fastify.register(fastifySwaggerUi, swaggerUiOptions)
}

export const swaggerPlugin = fp(plugin, {
    name: "swagger-plugin",
})
