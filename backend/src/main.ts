import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,               // Allows cookies / credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // SET DEFAULT PORT TO 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend running on: http://localhost:${port}`);
}
bootstrap();