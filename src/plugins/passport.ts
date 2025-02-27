import fastifyPassport from "@fastify/passport"
import fastifySession from "@fastify/session"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fp from "fastify-plugin"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as SteamStrategy } from "passport-steam"

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const { auth } = options
    fastify.register(fastifySession, {
        secret: options.auth.sessionSecret,
    })

    fastify.register(fastifyPassport.initialize())
    fastify.register(fastifyPassport.secureSession())

    fastifyPassport.registerUserSerializer(async (user, request) => {
        return user
    })

    fastifyPassport.registerUserDeserializer(async (user, request) => {
        return user
    })

    fastifyPassport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: auth.googleClientId,
                clientSecret: auth.googleClientSecret,
                callbackURL: "http://localhost:8080/api/auth/google/callback",
            },
            function (accessToken: any, refreshToken: any, profile: any, done: any) {
                return done(null, profile)
            }
        )
    )

    fastifyPassport.use(
        "steam",
        new SteamStrategy(
            {
                returnURL: "http://localhost:8080/api/auth/steam/callback",
                realm: "http://localhost:8080/",
                apiKey: "7DE1308F391F276B869AA7D4525DD839",
            },
            function (identifier: any, profile: any, done: any) {
                return done(null, profile)
            }
        )
    )
}

export const passportPlugin = fp(plugin, {
    name: "passport-plugin",
})
