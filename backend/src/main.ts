import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permite la comunicación desde el puerto de Vite
  await app.listen(3000);
}
bootstrap();
