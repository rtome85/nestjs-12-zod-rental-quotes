import 'reflect-metadata';
import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RentalQuotesController } from './rental-quotes.controller.js';

@Module({ controllers: [RentalQuotesController] })
class AppModule {}

export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  return app;
}
