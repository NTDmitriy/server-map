import fastifyCors from "@fastify/cors"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fp from "fastify-plugin"

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.register(fastifyCors, {
      origin: [
        "http://localhost:3000",
      ],
        credentials: true,
    })
}

export const corsPlugin = fp(plugin, {
    name: "cors-plugin",
})
