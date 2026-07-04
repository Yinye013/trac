import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Add the deployed frontend's Vercel URL here (via env var) once apps/web is deployed.
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  ...(process.env.WEB_ORIGIN ? [process.env.WEB_ORIGIN] : []),
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: ALLOWED_ORIGINS });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
