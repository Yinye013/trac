import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Terminus's default 1000ms ping timeout is too tight for Neon's
      // pooled connection — same class of latency we've seen elsewhere
      // (see prisma-transaction-options.ts) — so it's bumped here too.
      () =>
        this.prismaHealth.pingCheck('database', this.prisma, {
          timeout: 5000,
        }),
    ]);
  }
}
