"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
class BadRequestError extends Error {
    constructor(message) {
        super(`Bad Request: ${message}`);
        this.name = 'InvalidParamError';
    }
}
exports.BadRequestError = BadRequestError;
