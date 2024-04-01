"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDownloadFile = void 0;
const zod_1 = require("zod");
const client_s3_1 = require("@aws-sdk/client-s3");
const http_helpers_1 = require("../../../presentation/helpers/http-helpers");
const missing_param_error_1 = require("../../../presentation/errors/missing-param-error");
const node_console_1 = __importDefault(require("node:console"));
async function handleDownloadFile(req, res) {
    const paramsObj = zod_1.z.object({
        fileId: zod_1.z.string(),
    });
    const { fileId } = paramsObj.parse(req.params);
    if (!fileId) {
        return (0, http_helpers_1.badRequest)(new missing_param_error_1.MissingParamError('fileId'));
    }
    // todo Get from database
    const s3Client = new client_s3_1.S3Client({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: process.env.REGION,
    });
    const { Body } = await s3Client.send(new client_s3_1.GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: 'HpT-399_nextjs.mp3',
    }));
    node_console_1.default.log('aoooo');
    return res.send(Body?.transformToWebStream());
}
exports.handleDownloadFile = handleDownloadFile;
