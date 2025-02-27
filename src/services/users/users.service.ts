import { Role, User } from "@prisma/client"

import { hash } from "argon2"
import { FastifyBaseLogger } from "fastify"
import { prisma } from "../../prismaClient"
import roles from "../../roles.json"
import { TRoles } from "../../types/role.type"
import { IAuthData, IAuthSteamData, ISystemAuthData } from "./users.type"

class UsersService {
    private log: FastifyBaseLogger
    private roles: TRoles[]

    constructor(params: { log: FastifyBaseLogger }) {
        this.log = params.log
        this.roles = roles as TRoles[]
    }

    async init({ systemLogin, systemPassword }: ISystemAuthData) {
        this.log.info({}, "users.init")

        await Promise.all([
            // await this.createIndex(),
            // await this.updateRoles(),
            await this.createSystemUser(systemLogin, systemPassword),
        ])

        this.log.info({ success: true }, "users.init")
    }

    async create(data: IAuthData): Promise<User> {
        const { email, password, name, picture: avatarPath, system } = data

        return prisma.user.create({
            data: {
                email,
                password,

                ...(system && { roles: [Role.SUPER_ADMIN] }),
                ...(name && { name }),
                ...(avatarPath && { avatarPath }),
            },
        })
    }
    async createWithSteam(data: IAuthSteamData): Promise<User> {
        const { name, picture: avatarPath, system, steamId } = data

        return prisma.user.create({
            data: {
                steamId,
                ...(system && { roles: [Role.SUPER_ADMIN] }),
                ...(name && { name }),
                ...(avatarPath && { avatarPath }),
            },
        })
    }

    async getByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
    async getBySteamId(steamId: string) {
        return await prisma.user.findUnique({
            where: {
                steamId,
            },
        })
    }

    async getById(id: string) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        })
    }

    async update(data: Partial<User>, id: string) {
        return prisma.user.update({
            where: {
                id,
            },
            data,
        })
    }

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        })
    }

    async isGranted(id: string, permission: string): Promise<boolean> {
        this.log.info({ user: id, permission }, "users.isGranted")

        const user = await this.getById(id)
        if (!user || !user.roles) return false

        const permissions = await this.getPermissions(user.roles)
        if (!permissions || permissions.length === 0) return false

        const result = permissions.includes(permission)

        return result
    }

    async getPermissions(roles: Role[]): Promise<string[]> {
        this.log.info({ roles }, "users.getPermissions")

        const permissionsSet = new Set<string>()

        for (const role of roles) {
            const rolePermissions = await this.getPermissionsForRole(role)

            if (rolePermissions) {
                rolePermissions.forEach(p => permissionsSet.add(p))
            }
        }

        return Array.from(permissionsSet)
    }

    private async getPermissionsForRole(role: string): Promise<string[] | null> {
        this.log.info({ role }, "users.getPermissionsForRole")

        const foundRole = this.roles.find(r => r.name === role)

        if (foundRole) {
            return foundRole.permissions
        }

        this.log.warn({ role }, "Роль не найдена")
        return null
    }

    async createSystemUser(email: string, password: string) {
        this.log.info({ email }, "users.createSystemUser")

        const user = await this.getByEmail(email)

        if (user) {
            this.log.info({ email }, "users.createSystemUser: user already exists")

            return true
        }

        const hashPassword = await hash(password)

        const result = await this.create({
            email: email,
            password: hashPassword,
            system: true,
        })

        this.log.info({ password, result }, "users.createSystemUser")

        return true
    }
}

export default UsersService
