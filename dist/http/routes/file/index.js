"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileHandler = void 0;
const download_1 = require("./download");
async function fileHandler(app) {
    app.post('/', async () => { });
    app.get('/:fileId', download_1.handleDownloadFile);
}
exports.fileHandler = fileHandler;
