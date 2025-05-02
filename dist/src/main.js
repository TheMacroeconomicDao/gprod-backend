"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const env_helper_1 = require("./common/helpers/env.helper");
const express_rate_limit_1 = require("express-rate-limit");
const winston_logger_1 = require("./common/logger/winston.logger");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: new winston_logger_1.WinstonLogger() });
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://your-prod-domain.com',
        ],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use((0, express_rate_limit_1.default)({ windowMs: 60_000, max: 100 }));
    app.use(express.json({ limit: '1mb' }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('GProd API')
        .setDescription('REST API for users, auth, projects')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(env_helper_1.EnvHelper.int('PORT', 3000));
}
bootstrap();
//# sourceMappingURL=main.js.map