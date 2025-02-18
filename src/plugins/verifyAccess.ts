import fastifyJwt from "@fastify/jwt"
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const { auth } = options

    fastify.register(fastifyJwt, {
        secret: auth.secret,
    })

    fastify.decorate("verifyAccess", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            const { accessToken, refreshToken } = request.cookies

            if (accessToken && !refreshToken) {
                const decoded = fastify.jwt.verify(accessToken)

                ;(request as any).user = decoded
                return
            }

            if (refreshToken) {
                const decoded = fastify.jwt.verify(refreshToken)

                ;(request as any).user = decoded
                return
            }
            reply.status(401).send({ error: "Unauthorized" })
        } catch (err: unknown) {
            reply.status(401).send({ error: "Unauthorized", message: (err as Error).message })
        }
    })
}

export const verifyToken = fp(plugin, {
    name: "verifyAccess-plugin",
})
