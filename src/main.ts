import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/http-exception.filter.js';
import { GlobalValidationPipe } from './common/validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
  app.use(helmet());

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(GlobalValidationPipe);

  const config = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('Users + ledger with idempotent debit, balance recompute from history')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'Idempotency-Key', in: 'header' }, 'idempotency')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`🚀 Listening on http://localhost:${port}`);
}

bootstrap();
