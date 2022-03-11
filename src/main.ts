import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.intercetor';
import {
  swaggerConfig,
  swaggerOptions,
  swaggerCustomOptions,
} from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('/api/docs', app, document, swaggerCustomOptions);

  const PORT: number = parseInt(process.env.PORT, 10) || 3000;

  await app.listen(PORT);

  logger.log(`App listening on PORT ${PORT}`);
}

bootstrap();
