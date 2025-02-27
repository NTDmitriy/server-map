"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("@fastify/passport"));
const api_methods_type_1 = require("./types/api-methods.type");
const tags_type_1 = require("./types/tags.type");
exports.default = async (app, { services, procedures }) => {
    for (const { Procedure, path } of procedures) {
        const { title, method, paramsSchema, resultSchema, tags, ...rest } = Procedure;
        const procInstance = new Procedure({ services, log: app.log });
        const auth = [];
        if (!tags.includes(tags_type_1.API_GUARD.PUBLIC)) {
            auth.push(app.verifyAccess);
        }
        if (tags.includes(tags_type_1.HELPFUL_TAGS.PASSPORT_GOOGLE)) {
            auth.push(passport_1.default.authenticate("google", {
                scope: ["profile", "email"],
            }));
        }
        if (tags.includes(tags_type_1.HELPFUL_TAGS.PASSPORT_STEAM)) {
            auth.push(passport_1.default.authenticate("steam", {
                scope: ["profile"],
            }));
        }
        app.route({
            method,
            url: `/api/${path}/${title}`,
            ...(auth.length && { preValidation: app.auth(auth) }),
            schema: {
                ...(method === api_methods_type_1.API_METHODS.GET
                    ? {
                        querystring: paramsSchema,
                    }
                    : {
                        body: paramsSchema,
                    }),
                response: {
                    200: resultSchema,
                },
                tags: [tags[1]],
                ...rest,
            },
            handler: async function (request, reply) {
                try {
                    const params = method === api_methods_type_1.API_METHODS.GET ? request.query : request.body;
                    const user = request.user;
                    params.user = user;
                    const result = await procInstance.exec(params);
                    if (tags.includes(tags_type_1.API_GUARD.PRIVATE) && user && user.userId) {
                        services.tokens.generateAccessToken({ userId: user.userId }, reply);
                    }
                    if (tags.includes(tags_type_1.HELPFUL_TAGS.SIGNIN) && result && result.id) {
                        services.tokens.generateTokens({ userId: result.id }, reply);
                    }
                    if (tags.includes(tags_type_1.HELPFUL_TAGS.LOGOUT)) {
                        services.tokens.clearAuthTokens(reply);
                    }
                    if (tags.includes(tags_type_1.HELPFUL_TAGS.PASSPORT_CALLBACK)) {
                        await reply.redirect("http://localhost:3000");
                    }
                    await reply.send(result);
                }
                catch (error) {
                    app.log.error(error);
                    let err = "";
                    if (error instanceof Error) {
                        err = error.message;
                    }
                    reply.status(500).send({ error: err || "Internal Server Error" });
                }
            },
        });
    }
};
