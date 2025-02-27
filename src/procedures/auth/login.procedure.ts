import { User } from "@prisma/client"
import { verify } from "argon2"
import { IAuthData } from "../../services/users/users.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "login"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.AUTH, HELPFUL_TAGS.SIGNIN]
    static summary = "Вход в систему"

    static paramsSchema = {
        type: "object",
        required: ["email", "password"],
        additionalProperties: false,
        properties: {
            email: {
                type: "string",
                format: "email",
                errorMessage: "Email введен не корректно",
            },
            password: {
                type: "string",
            },
        },
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

    async execute(params: IAuthData): Promise<User> {
        const { email, password } = params

        const user = await this.services.users.getByEmail(email)
        if (!user || !user.password) throw new Error("Неверный логин или пароль")

        const isPasswordValid = await verify(user.password, password)

        if (!isPasswordValid) throw new Error("Неверный логин или пароль")

        return user
    }
}

export default LoginProcedure
