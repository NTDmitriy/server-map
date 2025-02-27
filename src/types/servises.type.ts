import PassportService from "../services/passport/passport.service"
import TokensService from "../services/tokens/tokens.service"
import UsersService from "../services/users/users.service"

export type TServices = {
    users: UsersService
    passport: PassportService
    tokens: TokensService
}
