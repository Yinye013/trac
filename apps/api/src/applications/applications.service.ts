import { Injectable, NotFoundException } from '@nestjs/common';
import { paginate } from '../common/dto/paginated-response.dto';
import { NEON_TRANSACTION_OPTIONS } from '../common/prisma-transaction-options';
import { Status } from '../generated/prisma/enums';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ApplicationsQueryDto } from './dto/applications-query.dto';
import type { CreateApplicationDto } from './dto/create-application.dto';
import type { UpdateApplicationDto } from './dto/update-application.dto';

const DUE_FOLLOWUP_LIMIT = 50;

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto) {
    const appliedAt = this.resolveAppliedAt(dto.status, dto.appliedAt);

    return this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        title: dto.title,
        company: dto.company,
        url: dto.url,
        status: dto.status,
        appliedAt,
        followUpAt: dto.followUpAt ? new Date(dto.followUpAt) : undefined,
        resumeVersion: dto.resumeVersion,
        notes: dto.notes,
      },
    });
  }

  /**
   * Creates an Application directly from an existing Job — the "shortcut"
   * path used by POST /jobs/:id/apply. Looks up the Job and inserts the
   * Application in one transaction so the two never diverge (e.g. the Job
   * being deleted between the lookup and the insert).
   */
  async createFromJob(
    jobId: string,
    extra: { resumeVersion?: string; notes?: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.job.findUnique({ where: { id: jobId } });
      if (!job) {
        throw new NotFoundException(`Job with id "${jobId}" not found`);
      }

      return tx.application.create({
        data: {
          jobId: job.id,
          title: job.title,
          company: job.company,
          url: job.url,
          status: Status.APPLIED,
          appliedAt: new Date(),
          resumeVersion: extra.resumeVersion,
          notes: extra.notes,
        },
      });
    }, NEON_TRANSACTION_OPTIONS);
  }

  async findAll(query: ApplicationsQueryDto) {
    const {
      page,
      limit,
      status,
      createdFrom,
      createdTo,
      followUpFrom,
      followUpTo,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.ApplicationWhereInput = {
      ...(status && { status }),
      ...((createdFrom || createdTo) && {
        createdAt: {
          ...(createdFrom && { gte: new Date(createdFrom) }),
          ...(createdTo && { lte: new Date(createdTo) }),
        },
      }),
      ...((followUpFrom || followUpTo) && {
        followUpAt: {
          ...(followUpFrom && { gte: new Date(followUpFrom) }),
          ...(followUpTo && { lte: new Date(followUpTo) }),
        },
      }),
    };

    const [data, totalItems] = await this.prisma.$transaction(
      [
        this.prisma.application.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.application.count({ where }),
      ],
      NEON_TRANSACTION_OPTIONS,
    );

    return paginate(data, { page, limit, totalItems });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id "${id}" not found`);
    }

    return application;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    await this.ensureExists(id);

    const appliedAt = this.resolveAppliedAt(dto.status, dto.appliedAt);

    return this.prisma.application.update({
      where: { id },
      data: {
        jobId: dto.jobId,
        title: dto.title,
        company: dto.company,
        url: dto.url,
        status: dto.status,
        appliedAt,
        followUpAt: dto.followUpAt ? new Date(dto.followUpAt) : undefined,
        resumeVersion: dto.resumeVersion,
        notes: dto.notes,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.application.delete({ where: { id } });
  }

  async findDueFollowUps() {
    const where: Prisma.ApplicationWhereInput = {
      followUpAt: { lte: new Date() },
    };

    const [data, totalItems] = await this.prisma.$transaction(
      [
        this.prisma.application.findMany({
          where,
          orderBy: { followUpAt: 'asc' },
          take: DUE_FOLLOWUP_LIMIT,
        }),
        this.prisma.application.count({ where }),
      ],
      NEON_TRANSACTION_OPTIONS,
    );

    return paginate(data, { page: 1, limit: DUE_FOLLOWUP_LIMIT, totalItems });
  }

  /**
   * If status is being set to APPLIED and this request didn't itself supply
   * appliedAt, auto-set it to now. An explicit appliedAt in the request is
   * never overwritten, and this only looks at the current request's fields —
   * not whatever the row already has stored.
   */
  private resolveAppliedAt(
    status: Status | undefined,
    appliedAt: string | undefined,
  ): Date | undefined {
    if (status === Status.APPLIED && !appliedAt) {
      return new Date();
    }
    return appliedAt ? new Date(appliedAt) : undefined;
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.application.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(`Application with id "${id}" not found`);
    }
  }
}
