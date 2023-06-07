import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = new DocumentBuilder()
  .setTitle('Startup')
  .setDescription('The startup API description')
  .setVersion('1.0.0')
  .addTag('NodeJs, NestJs, MongoDB, Mongoose, Jwt, Swagger')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'Bearer',
  )
  .build();
