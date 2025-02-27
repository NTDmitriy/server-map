import { User } from "@prisma/client"
import { hash } from "argon2"
import { IAuthData } from "../../services/users/users.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "register"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.AUTH, HELPFUL_TAGS.SIGNIN]
    static summary = "Регистрания нового пользователя"

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
                minLength: 8,
                errorMessage: "Минимальная длинна пароля - 8 символов",
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

        const candidate = await this.services.users.getByEmail(email)
        if (candidate) throw new Error("Данный email не доступен для регистрации")

        const hashedPassword = await hash(password)

        const user = await this.services.users.create({ email, password: hashedPassword })

        return user
    }
}

export default LoginProcedure
