import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5000;

  const config = new DocumentBuilder().setTitle('API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser()); 

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true, // чтобы работали куки
  });

  await app.listen(PORT);
  console.log(`app listening on: ${PORT}`);
}
bootstrap();
