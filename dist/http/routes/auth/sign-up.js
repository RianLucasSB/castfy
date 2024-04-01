"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignUp = void 0;
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../../lib/prisma");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function handleSignUp(req, res) {
    const signUpBody = zod_1.default.object({
        name: zod_1.default.string(),
        email: zod_1.default.string().email(),
        password: zod_1.default.string(),
        birthDate: zod_1.default.coerce.date().refine((data) => data < new Date(), {
            message: 'Start date must be in the past',
        }),
        gender: zod_1.default.nativeEnum(client_1.Gender),
    });
    const { name, email, password, gender, birthDate } = signUpBody.parse(req.body);
    const hashedPassword = await bcrypt_1.default.hash(password, 8);
    const created = await prisma_1.prisma.user.create({
        data: {
            email,
            name,
            gender,
            birthDate,
            password: hashedPassword,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: created.id }, process.env.JWT_PASS ?? '');
    return res.status(201).send({
        id: created.id,
        token,
    });
}
exports.handleSignUp = handleSignUp;
