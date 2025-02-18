import TokensService from "../services/tokens.service"
import UsersService from "../services/users/users.service"

export type TServices = {
    users: UsersService

    tokens: TokensService
}
