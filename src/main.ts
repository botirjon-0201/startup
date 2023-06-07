import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    const config = getSwaggerConfig;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/startup', app, document);

    await app.listen(parseInt(process.env.PORT) || 5555);
    console.log(`Server is working on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
