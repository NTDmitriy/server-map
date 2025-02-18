export const TAGS = {
    AUTH: "Auth",
    USER: "User",
    SIGNIN: "Signin",
    REFRESH: "Refresh",
    LOGOUT: "Logout",
} as const

export type TProcedureTag = (typeof TAGS)[keyof typeof TAGS]

export const API_GUARD = {
    PUBLIC: "Public",
    PRIVATE: "Private",
    ADMINONLY: "AdminOnly",
} as const

export type TApiGuard = (typeof API_GUARD)[keyof typeof API_GUARD]

export type TTags = [TApiGuard, ...TProcedureTag[]]
