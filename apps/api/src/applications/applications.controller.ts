import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsQueryDto } from './dto/applications-query.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll(@Query() query: ApplicationsQueryDto) {
    return this.applicationsService.findAll(query);
  }

  // Registered before GET /applications/:id so "due-followup" and "stats"
  // are matched as these literal routes rather than swallowed as :id path
  // params.
  @Get('due-followup')
  findDueFollowUps() {
    return this.applicationsService.findDueFollowUps();
  }

  @Get('stats')
  async getStats() {
    const data = await this.applicationsService.getStatusCounts();
    return { success: true, data };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.applicationsService.remove(id);
    return { success: true };
  }
}
