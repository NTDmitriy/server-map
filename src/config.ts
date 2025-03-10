import "dotenv/config"

export interface IConfig {
    app: {
        port: number
    }
    auth: {
        secret: string
        systemUser: string
        systemUserPassword: string
        googleClientId: string
        googleClientSecret: string
        sessionSecret: string
    }
}

export default (): IConfig => {
    const requader = (name: string) => {
        if (!process.env[name]) {
            throw new Error(`Environment variable ${name} is not set`)
        }
        return process.env[name]
    }

    return {
        app: {
            port: parseInt(process.env.PORT || "8080"),
        },
        auth: {
            secret: requader("AUTH_SECRET"),
            systemUser: requader("SYSTEM_USER"),
            systemUserPassword: requader("SYSTEM_USER_PASSWORD"),
            googleClientId: requader("GOOGLE_CLIENT_ID"),
            googleClientSecret: requader("GOOGLE_CLIENT_SECRET"),
            sessionSecret: requader("SESSION_SECRET"),
        },
    }
}
