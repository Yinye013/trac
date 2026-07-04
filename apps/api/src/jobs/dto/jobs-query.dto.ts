import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Eligibility, Region } from '../../generated/prisma/enums';

const KNOWN_SOURCES = [
  'himalayas',

  'remoteok',
  'arbeitnow',
  'remotive',
] as const;

export class JobsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 20;

  @IsOptional()
  @IsEnum(Eligibility)
  eligibility?: Eligibility;

  @IsOptional()
  @IsEnum(Region)
  region?: Region;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  postedSince: number = 14;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsIn(KNOWN_SOURCES)
  source?: string;
}
