import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // React frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // If you're using cookies or sessions
  });

  const config = new DocumentBuilder()
    .setTitle('Quiz')
    .setDescription('The best API documentation ever!')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Listen on port
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
