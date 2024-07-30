import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.enableCors();
  await app.listen(PORT, () => {
    console.log(`INFO: Server started on ${PORT} port!`)
  })
}

start();
