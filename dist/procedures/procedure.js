"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_type_1 = require("../types/tags.type");
class Procedure {
    constructor(params) {
        this.services = params.services;
        this.log = params.log;
    }
    async execute(params, user) {
        return null;
    }
    async exec(params) {
        this.log.trace({ params }, "pd.exec");
        const { user, ...data } = params;
        const cls = this.constructor;
        if (cls.tags.includes(tags_type_1.API_GUARD.PUBLIC)) {
            return this.execute(data, user);
        }
        const [name, tag] = [cls.title, cls.tags[1].toLowerCase()];
        const isGranted = await this.services.users.isGranted(user.userId, `${tag}:${name}`);
        if (!isGranted) {
            const error = new Error(`У пользователя ${user.userId} нет доступа к выполнению процедуры ${tag}:${name}`);
            error.status = 403;
            throw error;
        }
        return this.execute(data);
    }
}
exports.default = Procedure;
