"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandler = void 0;
const sign_up_1 = require("./sign-up");
const sign_in_1 = require("./sign-in");
async function authHandler(app) {
    app.post('/sign-up', sign_up_1.handleSignUp);
    app.post('/sign-in', sign_in_1.handleSignIn);
}
exports.authHandler = authHandler;
