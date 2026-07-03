import { Injectable } from '@nestjs/common';
import type { Ping } from '@job-tracker/shared';

@Injectable()
export class AppService {
  getHello(): string {
    const ping: Ping = { message: 'pong from shared', timestamp: Date.now() };
    console.log('[api] shared package linked:', ping);
    return 'Hello World!';
  }
}
