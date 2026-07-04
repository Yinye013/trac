import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Status } from '../../generated/prisma/enums';

const SORT_FIELDS = ['createdAt', 'followUpAt', 'updatedAt'] as const;
type SortField = (typeof SORT_FIELDS)[number];

const SORT_ORDERS = ['asc', 'desc'] as const;
type SortOrder = (typeof SORT_ORDERS)[number];

export class ApplicationsQueryDto {
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
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @IsOptional()
  @IsDateString()
  followUpFrom?: string;

  @IsOptional()
  @IsDateString()
  followUpTo?: string;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy: SortField = 'createdAt';

  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder: SortOrder = 'desc';
}
