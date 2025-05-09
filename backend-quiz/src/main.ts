import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as socketIo from 'socket.io';
import { Server } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP requests
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add both frontend URLs here
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies or authentication data if needed
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Quiz')
    .setDescription('The best API documentation ever!')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validation pipes for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Initialize Socket.io with CORS configuration for WebSocket connections

  // WebSocket event handling

  // Start the NestJS HTTP server
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
