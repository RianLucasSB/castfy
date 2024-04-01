"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, done) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error('Não autorizado');
    }
    const token = authorization.split(' ')[1];
    const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_PASS ?? '');
    req.headers.userId = userId;
    done();
};
exports.authMiddleware = authMiddleware;
