import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApplicationsService } from '../applications/applications.service';
import { Prisma } from '../generated/prisma/client';
import { paginate } from '../common/dto/paginated-response.dto';
import { NEON_TRANSACTION_OPTIONS } from '../common/prisma-transaction-options';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyToJobDto } from './dto/apply-to-job.dto';
import { JobsQueryDto } from './dto/jobs-query.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly prisma: PrismaService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  async findAll(@Query() query: JobsQueryDto) {
    const { page, limit, eligibility, region, postedSince, role, source } =
      query;

    const postedAtGte = new Date(
      Date.now() - postedSince * 24 * 60 * 60 * 1000,
    );

    // Prisma's array filters (`has`/`hasSome`) only do exact element matches,
    // not case-insensitive substring matches, so a `role` filter needs a raw
    // ILIKE against the title and against the tags array joined to text.
    const conditions: Prisma.Sql[] = [Prisma.sql`"postedAt" >= ${postedAtGte}`];
    if (eligibility)
      conditions.push(
        Prisma.sql`"eligibility" = ${eligibility}::"Eligibility"`,
      );
    if (region) conditions.push(Prisma.sql`"region" = ${region}::"Region"`);
    if (source) conditions.push(Prisma.sql`"source" = ${source}`);
    if (role) {
      const pattern = `%${role}%`;
      conditions.push(
        Prisma.sql`("title" ILIKE ${pattern} OR EXISTS (SELECT 1 FROM unnest("tags") AS tag WHERE tag ILIKE ${pattern}))`,
      );
    }

    const whereClause = Prisma.join(conditions, ' AND ');

    const [data, totalItemsResult] = await this.prisma.$transaction(
      [
        this.prisma.$queryRaw<
          Array<Record<string, unknown>>
        >`SELECT * FROM "Job" WHERE ${whereClause} ORDER BY "postedAt" DESC OFFSET ${(page - 1) * limit} LIMIT ${limit}`,
        this.prisma.$queryRaw<
          Array<{ count: bigint }>
        >`SELECT COUNT(*) as count FROM "Job" WHERE ${whereClause}`,
      ],
      NEON_TRANSACTION_OPTIONS,
    );

    const totalItems = Number(totalItemsResult[0]?.count ?? 0);

    return paginate(data, { page, limit, totalItems });
  }

  @Post('refresh')
  @Throttle({ default: { limit: 2, ttl: 60 * 60 * 1000 } })
  async refresh() {
    const summary = await this.jobsService.ingestJobs();
    return { success: true, data: summary };
  }

  @Post(':id/apply')
  applyToJob(@Param('id') id: string, @Body() dto: ApplyToJobDto) {
    return this.applicationsService.createFromJob(id, dto);
  }
}
