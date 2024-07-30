import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {

  private adapterConstructor: ReturnType<typeof createAdapter>;

  
  constructor(app: any, private readonly configService: ConfigService){
    super(app);
  }

  async connectToRedis(): Promise<void> {
    console.log('redis connection string', this.configService.get<string>('redis.url'))
    const pubClient = createClient({ url: this.configService.get<string>('redis.url') });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}