import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../../generated/prisma/enums';

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  jobId?: string;

  @IsString()
  title!: string;

  @IsString()
  company!: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @IsOptional()
  @IsDateString()
  followUpAt?: string;

  @IsOptional()
  @IsString()
  resumeVersion?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
