import {
  DocumentBuilder,
  ExpressSwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Flights API')
  .setDescription('Scheduled Flights App')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();

const swaggerOptions: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string): string =>
    `${methodKey}_${controllerKey.slice(0, -10).toLowerCase()}`,
    
};

const swaggerCustomOptions: ExpressSwaggerCustomOptions = {
  customSiteTitle: 'Flights API Docs',
  swaggerOptions: { filter: true,   tagsSorter: 'alpha',
  operationsSorter: 'alpha', },
};

export { swaggerConfig, swaggerOptions, swaggerCustomOptions };
