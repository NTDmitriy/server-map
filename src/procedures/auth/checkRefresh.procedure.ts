import { IAuthData } from "../../services/users/users.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "checkRefresh"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.AUTH]
    static summary = "Обновить access токен через refresh токен"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "null",
        additionalProperties: false,
    }

    async execute(params: IAuthData): Promise<null> {
        return null
    }
}

export default LoginProcedure
