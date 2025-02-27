import { User } from "@prisma/client"
import { hash } from "argon2"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "google/callback"
    static method = API_METHODS.GET
    static tags: TTags = [
        API_GUARD.PUBLIC,
        MAIN_TAGS.AUTH,
        HELPFUL_TAGS.SIGNIN,
        HELPFUL_TAGS.PASSPORT_GOOGLE,
        HELPFUL_TAGS.PASSPORT_CALLBACK,
    ]
    static summary = "Колбэк гугла после успешной аунтификации"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
        },
    }

    async execute(params: any, user: any): Promise<User> {
        const { name, picture, email } = user._json

        const candidate = await this.services.users.getByEmail(email)
        if (candidate) return candidate

        const hashedPassword = await hash(
            [...Array(8)].map(() => Math.random().toString(36)[2]).join("")
        )

        const newUser = await this.services.users.create({
            email,
            password: hashedPassword,
            name,
            picture,
        })

        return newUser
    }
}

export default LoginProcedure
