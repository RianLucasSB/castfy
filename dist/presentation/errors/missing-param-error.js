"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingParamError = void 0;
class MissingParamError extends Error {
    constructor(paramName) {
        super(`Invalid param: ${paramName}`);
        this.name = 'InvalidParamError';
    }
}
exports.MissingParamError = MissingParamError;
