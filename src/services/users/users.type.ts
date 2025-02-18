export interface IAuthData {
    email: string
    password: string
}
export interface ISystemAuthData {
    systemLogin: string
    systemPassword: string
}

export interface IUserInToken {
    userId: string
    iat: number
    exp: number
}
