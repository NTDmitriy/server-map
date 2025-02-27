"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2_1 = require("argon2");
const prismaClient_1 = require("../../prismaClient");
const roles_json_1 = __importDefault(require("../../roles.json"));
class UsersService {
    constructor(params) {
        this.log = params.log;
        this.roles = roles_json_1.default;
    }
    async init({ systemLogin, systemPassword }) {
        this.log.info({}, "users.init");
        await Promise.all([
            // await this.createIndex(),
            // await this.updateRoles(),
            await this.createSystemUser(systemLogin, systemPassword),
        ]);
        this.log.info({ success: true }, "users.init");
    }
    async create(data) {
        const { email, password, name, picture: avatarPath, system } = data;
        return prismaClient_1.prisma.user.create({
            data: {
                email,
                password,
                ...(system && { roles: [client_1.Role.SUPER_ADMIN] }),
                ...(name && { name }),
                ...(avatarPath && { avatarPath }),
            },
        });
    }
    async createWithSteam(data) {
        const { name, picture: avatarPath, system, steamId } = data;
        return prismaClient_1.prisma.user.create({
            data: {
                steamId,
                ...(system && { roles: [client_1.Role.SUPER_ADMIN] }),
                ...(name && { name }),
                ...(avatarPath && { avatarPath }),
            },
        });
    }
    async getByEmail(email) {
        return await prismaClient_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async getBySteamId(steamId) {
        return await prismaClient_1.prisma.user.findUnique({
            where: {
                steamId,
            },
        });
    }
    async getById(id) {
        return prismaClient_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async update(data, id) {
        return prismaClient_1.prisma.user.update({
            where: {
                id,
            },
            data,
        });
    }
    async deleteUser(id) {
        return await prismaClient_1.prisma.user.delete({
            where: { id },
        });
    }
    async isGranted(id, permission) {
        this.log.info({ user: id, permission }, "users.isGranted");
        const user = await this.getById(id);
        if (!user || !user.roles)
            return false;
        const permissions = await this.getPermissions(user.roles);
        if (!permissions || permissions.length === 0)
            return false;
        const result = permissions.includes(permission);
        return result;
    }
    async getPermissions(roles) {
        this.log.info({ roles }, "users.getPermissions");
        const permissionsSet = new Set();
        for (const role of roles) {
            const rolePermissions = await this.getPermissionsForRole(role);
            if (rolePermissions) {
                rolePermissions.forEach(p => permissionsSet.add(p));
            }
        }
        return Array.from(permissionsSet);
    }
    async getPermissionsForRole(role) {
        this.log.info({ role }, "users.getPermissionsForRole");
        const foundRole = this.roles.find(r => r.name === role);
        if (foundRole) {
            return foundRole.permissions;
        }
        this.log.warn({ role }, "Роль не найдена");
        return null;
    }
    async createSystemUser(email, password) {
        this.log.info({ email }, "users.createSystemUser");
        const user = await this.getByEmail(email);
        if (user) {
            this.log.info({ email }, "users.createSystemUser: user already exists");
            return true;
        }
        const hashPassword = await (0, argon2_1.hash)(password);
        const result = await this.create({
            email: email,
            password: hashPassword,
            system: true,
        });
        this.log.info({ password, result }, "users.createSystemUser");
        return true;
    }
}
exports.default = UsersService;
