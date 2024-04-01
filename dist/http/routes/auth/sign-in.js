"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignIn = void 0;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../../lib/prisma");
async function handleSignIn(req, res) {
    const signInBody = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    });
    const { email, password } = signInBody.parse(req.body);
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const matchPassword = await bcrypt_1.default.compare(password, user.password);
    if (!matchPassword) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign(user.id, process.env.JWT_PASS ?? '');
    res.status(201).send({
        id: user.id,
        email: user.email,
        name: user.name,
        token,
    });
}
exports.handleSignIn = handleSignIn;
