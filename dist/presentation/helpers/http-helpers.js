"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.serverError = exports.badRequest = void 0;
const server_error_1 = require("../errors/server-error");
const badRequest = (error) => {
    return {
        statusCode: 400,
        body: error,
    };
};
exports.badRequest = badRequest;
const serverError = () => {
    return {
        statusCode: 500,
        body: new server_error_1.ServerError(),
    };
};
exports.serverError = serverError;
const ok = (data) => {
    return {
        statusCode: 200,
        body: data,
    };
};
exports.ok = ok;
