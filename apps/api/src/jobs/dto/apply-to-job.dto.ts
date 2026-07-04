import { IsOptional, IsString } from 'class-validator';

export class ApplyToJobDto {
  @IsOptional()
  @IsString()
  resumeVersion?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
