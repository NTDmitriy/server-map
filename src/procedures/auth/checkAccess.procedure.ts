import { IAuthData } from "../../services/users/users.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "checkAccess"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PRIVATE, TAGS.AUTH]
    static summary = "Проверить access токенF"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    async execute(params: IAuthData): Promise<null> {
        return null
    }
}

export default LoginProcedure
