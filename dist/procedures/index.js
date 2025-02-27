"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getProcedures;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getProcedures() {
    const procedures = [];
    const baseDir = __dirname;
    fs_1.default.readdirSync(baseDir).forEach(function (file) {
        const dirPath = path_1.default.join(baseDir, file);
        if (fs_1.default.statSync(dirPath).isDirectory()) {
            fs_1.default.readdirSync(dirPath).forEach(function (fileName) {
                const filePath = path_1.default.join(dirPath, fileName);
                const requiredModule = require(filePath);
                procedures.push({
                    path: file,
                    Procedure: requiredModule.default || requiredModule,
                });
            });
        }
    });
    return procedures;
}
