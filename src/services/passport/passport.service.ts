import fastifyPassport from "@fastify/passport"

class PassportService {
    google() {
        return fastifyPassport.authenticate("google", {
            scope: ["profile", "email"],
        })
    }

    steam() {
        return fastifyPassport.authenticate("steam", {
            scope: ["profile"],
        })
    }
}

export default PassportService
