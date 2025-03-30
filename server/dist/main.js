"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const express = require("express");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use('/public', express.static(path_1.join(__dirname, '..', 'public')));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map