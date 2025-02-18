import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { IProcedure } from "./procedures"
import { IUserInToken } from "./services/users/users.type"
import { API_METHODS } from "./types/api-methods.type"
import { TServices } from "./types/servises.type"
import { API_GUARD, TAGS } from "./types/tags.type"

interface Params {
    procedures: IProcedure[]
    services: TServices
}

export default async (app: FastifyInstance, { services, procedures }: Params) => {
    for (const { Procedure, path } of procedures) {
        const { title, method, paramsSchema, resultSchema, tags, ...rest } = Procedure

        const procInstance = new Procedure({ services, log: app.log })

        const auth = []

        if (!tags.includes(API_GUARD.PUBLIC) && !tags.includes(TAGS.LOGOUT)) {
            auth.push((app as any).verifyAccess)
        }

        app.route({
            method,
            url: `/api/${path}/${title}`,
            ...(auth.length && { preValidation: app.auth(auth) }),
            schema: {
                ...(method === API_METHODS.GET
                    ? {
                          querystring: paramsSchema,
                      }
                    : {
                          body: paramsSchema,
                      }),
                response: {
                    200: resultSchema,
                },
                tags,
                ...rest,
            },

            handler: async function (request: FastifyRequest, reply: FastifyReply) {
                try {
                    const params = method === API_METHODS.GET ? request.query : request.body
                    const user: IUserInToken = request.user as IUserInToken

                    ;(params as any).user = user
                    const result = await procInstance.exec(params)

                    if (tags.includes(TAGS.LOGOUT)) {
                        services.tokens.clearTokens(reply)
                    } else {
                        if (tags.includes(TAGS.SIGNIN)) {
                            services.tokens.generateTokens({ userId: result.id }, reply)
                        }

                        if (tags.includes(API_GUARD.PRIVATE)) {
                            services.tokens.generateAccessToken({ userId: user.userId }, reply)
                        }
                    }

                    await reply.send(result)
                } catch (error) {
                    app.log.error(error)

                    let err = ""
                    if (error instanceof Error) {
                        err = error.message
                    }

                    reply.status(500).send({ error: err || "Internal Server Error" })
                }
            },
        })
    }
}
