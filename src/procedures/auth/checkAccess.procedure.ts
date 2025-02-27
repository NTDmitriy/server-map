import { User } from "@prisma/client"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { IAuthData } from "../../services/users/users.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "checkAccess"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.AUTH]
    static summary = "Проверить access токен"

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
            avatarPath: { type: "string" },
            roles: { type: "string" },
            steamId: { type: "string" },
        },
    }

    async execute(params: IAuthData, user: TJwtVerifyObject): Promise<User | null> {
        const userData = await this.services.users.getById(user.userId)
        if (!userData) return null

        return userData
    }
}

export default LoginProcedure
