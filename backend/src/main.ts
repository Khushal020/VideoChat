import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './chat/adapters/redis.io.adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const corsOptions = {
    origin: "*",
  };

  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);

  const configService = app.get(ConfigService);
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3000);
}
bootstrap();
