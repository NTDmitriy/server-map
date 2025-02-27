import { User } from "@prisma/client"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "steam/callback"
    static method = API_METHODS.GET
    static tags: TTags = [
        API_GUARD.PUBLIC,
        MAIN_TAGS.AUTH,
        HELPFUL_TAGS.SIGNIN,
        HELPFUL_TAGS.PASSPORT_STEAM,
        HELPFUL_TAGS.PASSPORT_CALLBACK,
    ]
    static summary = "Колбэк стим после успешной аунтификации"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            steamId: { type: "string" },
        },
    }

    static resultSchema = {
        type: "null",
        additionalProperties: false,
    }

    async execute(params: any, user: any): Promise<User> {
        const { personaname, avatar, steamid } = user._json

        const candidate = await this.services.users.getBySteamId(steamid)
        if (candidate) return candidate

        const newUser = await this.services.users.createWithSteam({
            name: personaname,
            picture: avatar,
            steamId: steamid,
        })

        return newUser
    }
}

export default LoginProcedure
