import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTimesheetDto } from '../auth/dto/create-timesheet.dto';
import { TimesheetService } from './timesheet.service';
import { UpdateTimesheetDto } from '../auth/dto/update-timesheet.dto';

@Controller('timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  async createTimesheet(@Body() createTimesheetDto: CreateTimesheetDto) {
    try {
      return this.timesheetService.createTimesheet(createTimesheetDto);
    } catch (err) {
      throw new InternalServerErrorException('Error creating timesheet');
    }
  }

  @Get()
  findAllTimesheets() {
    try {
      return this.timesheetService.findAllTimesheets();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheets');
    }
  }

  @Get(':id')
  findOneTimesheet(@Param('id') id: number) {
    try {
      return this.timesheetService.findOneTimesheet(+id);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheet');
    }
  }

  @Patch(':id')
  updateTimesheet(
    @Param('id') id: number,
    @Body() updateTimesheetDto: UpdateTimesheetDto,
  ) {
    try {
      return this.timesheetService.updateTimesheet(+id, updateTimesheetDto);
    } catch (error) {
      throw new InternalServerErrorException('Error updating timesheet');
    }
  }

  @Delete(':id')
  deleteTimesheet(@Param('id') id: number) {
    try {
      return this.timesheetService.deleteTimesheet(+id);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting timesheet');
    }
  }
}
